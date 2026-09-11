import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Carbon Capture Marketplace</h1>
          </div>
        </header>
        <main className="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={
              <div className="px-4 py-6 sm:px-0">
                <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                  <p className="text-gray-500 text-lg">Welcome to the Marketplace</p>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
