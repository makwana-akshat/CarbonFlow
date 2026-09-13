import re
from typing import Dict, Any, Optional, List

class ContextResolver:
    """
    Resolves conversational entity references (suppliers, orders, confirmations)
    from short-term structured Redis session state.
    """

    # Ordinal mappings for 1st, 2nd, 3rd, 4th supplier in English, Hindi, Hinglish
    ORDINAL_PATTERNS = [
        # Index 0: 1st
        (0, re.compile(r"\b(first|1st|pehl[aei]|pehla\s*wala|pehle\s*wale)\b|(पहला|पहले|पहले\s*वाले|प्रथम)", re.IGNORECASE)),
        # Index 1: 2nd
        (1, re.compile(r"\b(second|2nd|dusr[aei]|doosr[aei]|dusra\s*wala|dusre\s*wale)\b|(दूसरा|दूसरे|दूसरे\s*वाले|द्वितीय)", re.IGNORECASE)),
        # Index 2: 3rd
        (2, re.compile(r"\b(third|3rd|teesr[aei]|tisr[aei]|teesra\s*wala|teesre\s*wale)\b|(तीसरा|तीसरे|तीसरे\s*वाले|तृतीय)", re.IGNORECASE)),
        # Index 3: 4th
        (3, re.compile(r"\b(fourth|4th|chauth[aei])\b|(चौथा|चौथे)", re.IGNORECASE)),
    ]

    # Deictic patterns pointing to an already selected or singular supplier
    DEICTIC_PATTERNS = re.compile(
        r"\b(this|that|the|selected|that\s*one|this\s*one|ye\s*wala|yeh\s*wala|is\s*supplier|isi\s*supplier|yehi\s*supplier)\b",
        re.IGNORECASE
    )

    # Affirmation / Positive confirmation patterns (English, Hindi, Hinglish)
    CONFIRM_POSITIVE_PATTERNS = re.compile(
        r"^(yes|yeah|yep|sure|ok|okay|confirm|confirmed|proceed|go\s*ahead|do\s*it|place\s*it|place\s*the\s*order|haan|ha|haa|hanji|kar\s*do|kardo|place\s*kar\s*do|order\s*kar\s*do|thik\s*hai|theek\s*hai|sahi\s*hai|chalega)[\s\.\!\?]*$|"
        r"(हाँ|हां|कर\s*दो|हाँ\s*कर\s*दो|आर्डर\s*कर\s*दो|कन्फर्म|कन्फर्म\s*करो)",
        re.IGNORECASE
    )

    # Partial positive confirmations (e.g. "Yes, do it", "Yes, place it", "Haan, place karo")
    CONFIRM_POSITIVE_CONTAINED = re.compile(
        r"\b(yes\s*,\s*(do\s*it|place\s*it|go\s*ahead|proceed)|haan\s*,\s*(kar\s*do|place\s*karo|order\s*karo|place\s*kar\s*do)|go\s*ahead\s*and\s*place|please\s*place\s*the\s*order|confirm\s*order)\b",
        re.IGNORECASE
    )

    # Cancellation / Negative confirmation patterns
    CONFIRM_NEGATIVE_PATTERNS = re.compile(
        r"\b(no|nope|cancel|cancelled|stop|abort|don'?t|not\s*now|nahi|na|nah|mat\s*karo|rehne\s*do|ruk\s*jao|nahi\s*chahiye)\b|"
        r"(नहीं|रहने\s*दो|मत\s*करो|कैंसिल)",
        re.IGNORECASE
    )

    # Explicit order placement trigger words
    CREATE_ORDER_PATTERNS = re.compile(
        r"\b(place\s*(the\s*)?order|placed\s*(the\s*)?order|create\s*(an\s*)?order|"
        r"order\s*(this|from|the|with|these|that)|buy|purchase|"
        r"order\s*kar\s*do|order\s*place\s*kar\s*do|order\s*place\s*karo|order\s*karna\s*hai|"
        r"kharidna\s*hai|offtake\s*agreement|offtake)\b|"
        r"(order\s*कर\s*दो|ऑर्डर\s*कर\s*दो|आर्डर\s*कर\s*दो|खरीदना\s*है|ऑर्डर\s*दो|आर्डर\s*दो)",
        re.IGNORECASE
    )

    # Explicit order tracking trigger words
    TRACK_ORDER_PATTERNS = re.compile(
        r"\b(track|tracking|where\s*is|status\s*of|order\s*status|kahan\s*hai|kahan\s*tak|delivered\s*yet|has\s*it\s*been\s*delivered|shipment\s*status)\b",
        re.IGNORECASE
    )

    @classmethod
    def is_positive_confirmation(cls, text: str) -> bool:
        trimmed = text.strip()
        return bool(cls.CONFIRM_POSITIVE_PATTERNS.match(trimmed) or cls.CONFIRM_POSITIVE_CONTAINED.search(trimmed))

    @classmethod
    def is_negative_confirmation(cls, text: str) -> bool:
        trimmed = text.strip()
        # If user says "no problem, place it" or similar affirmative phrase, not negative
        if cls.CONFIRM_POSITIVE_CONTAINED.search(trimmed):
            return False
        return bool(cls.CONFIRM_NEGATIVE_PATTERNS.search(trimmed))

    @classmethod
    def resolve_supplier_reference(cls, text: str, session: Dict[str, Any]) -> Optional[str]:
        """
        Resolves a supplier reference from user text using structured session context.
        Returns the listing_id / supplier_id if resolved, else None.
        """
        last_supplier_ids: List[str] = session.get("last_supplier_ids") or []
        last_results: List[Dict[str, Any]] = session.get("last_search_results") or []

        # 1. Check ordinal references ("first one", "second", "पहला", "first wale")
        for idx, pattern in cls.ORDINAL_PATTERNS:
            if pattern.search(text):
                if 0 <= idx < len(last_supplier_ids):
                    return last_supplier_ids[idx]

        # 2. Check name matches against search results (e.g. "ABC Cement", "Axat", "Gulf Coast")
        lower_text = text.lower()
        for res in last_results:
            name = (res.get("supplier_name") or "").lower()
            company = (res.get("company_name") or "").lower()
            facility = (res.get("facility_name") or "").lower()
            listing_id = res.get("listing_id")

            if (name and len(name) > 2 and name in lower_text) or \
               (company and len(company) > 2 and company in lower_text) or \
               (facility and len(facility) > 2 and facility in lower_text):
                return listing_id

        # 3. Check deictic references ("that supplier", "this supplier", "the selected one")
        if cls.DEICTIC_PATTERNS.search(text):
            if session.get("selected_supplier_id"):
                return session.get("selected_supplier_id")
            # If only 1 supplier in last search results, implicitly that's the one
            if len(last_supplier_ids) == 1:
                return last_supplier_ids[0]

        # 4. Check if a raw UUID matches any known supplier/listing
        for sid in last_supplier_ids:
            if sid and sid in text:
                return sid

        # 5. Default back to already selected supplier if any
        return session.get("selected_supplier_id")

    @classmethod
    def resolve_order_reference(cls, text: str, session: Dict[str, Any]) -> Optional[str]:
        """
        Resolves an order ID reference from user text or context.
        Returns the order_id if found, else None.
        """
        # 1. Look for explicit ORD-XXXX pattern
        ord_match = re.search(r"\bORD-[A-Za-z0-9]+\b", text, re.IGNORECASE)
        if ord_match:
            return ord_match.group(0).upper()

        # 2. Look for UUID pattern
        uuid_match = re.search(r"\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b", text)
        if uuid_match:
            return uuid_match.group(0)

        # 3. If tracking pronoun/phrase ("it", "where is it", "track it", "my order", "status")
        # resolve from last_order_id in session
        if session.get("last_order_id"):
            pronoun_match = re.search(r"\b(it|my\s*order|the\s*order|this\s*order|that\s*order|status|where|kahan)\b", text, re.IGNORECASE)
            if pronoun_match or cls.TRACK_ORDER_PATTERNS.search(text):
                return session.get("last_order_id")

        return None

    @classmethod
    def detect_intent(cls, text: str, session: Dict[str, Any]) -> str:
        """
        Context-aware intent classification.
        Considers user text + pending action + conversational history.
        """
        pending_action = session.get("pending_action")
        requires_confirmation = session.get("requires_confirmation", False)

        # 1. Pending Action Confirmation/Cancellation takes highest precedence
        if pending_action == "CREATE_ORDER" and requires_confirmation:
            if cls.is_positive_confirmation(text):
                return "CONFIRM_CREATE_ORDER"
            if cls.is_negative_confirmation(text):
                return "CANCEL_PENDING_ACTION"

        # 2. Order Placement vs Tracking distinction
        is_create = bool(cls.CREATE_ORDER_PATTERNS.search(text))
        is_track = bool(cls.TRACK_ORDER_PATTERNS.search(text))

        # Explicit "placed the order" / "place the order"
        if is_create and not is_track:
            return "CREATE_ORDER"

        # Explicit order tracking
        if is_track and not is_create:
            return "TRACK_ORDER"

        # If both appear (e.g. "I placed the order, track it"), tracking is intended
        if is_track and is_create:
            if "track" in text.lower() or "where" in text.lower():
                return "TRACK_ORDER"
            return "CREATE_ORDER"

        # 3. Check supplier selection phrases without explicit "place order" (e.g. "I'll take the first one", "The first one looks good")
        for _, pattern in cls.ORDINAL_PATTERNS:
            if pattern.search(text):
                if session.get("last_supplier_ids"):
                    return "SELECT_SUPPLIER"

        return "UNKNOWN"
