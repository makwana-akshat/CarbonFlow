import os
import sys
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv()

from app.services.impact_service import ImpactService

def test():
    service = ImpactService()
    print("Overview:", service.get_overview())
    print("Journey:", len(service.get_journey()))
    print("Platform Summary:", service.get_platform_summary())
    print("Monthly Utilization:", service.get_monthly_utilization())
    print("Applications:", service.get_applications())
    print("Regional:", service.get_regional())
    print("Contributors:", len(service.get_contributors()))
    print("Recent Activity:", len(service.get_recent_activity()))

if __name__ == "__main__":
    test()
