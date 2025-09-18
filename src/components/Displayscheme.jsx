import React, { useState, useEffect } from 'react'

export const Displayscheme = () => {
  const [recommendedSchemes, setRecommendedSchemes] = useState([])
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Example user data - you can get this from props or form input
  const exampleUserData = {
    "Name of the Claimant": "John Doe",
    "State": "Maharashtra",
    "Scheduled Tribe": "Yes",
    "Other Traditional Forest Dweller": "No",
    "Age": 35,
    "For Habitation": "Yes",
    "For Self-Cultivation": "Yes",
    "DisputedLands": "No",
    "Pattas": "Yes",
    "Land from Where Displaced Without Compensation": "N/A",
    "Extent of Land in Forest Villages": 2.5
  }

  const getRecommendations = async (userData) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userData: userData })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setRecommendedSchemes(data.recommendedSchemes)
        setUserName(data.userName)
      } else {
        setError(data.error || 'Failed to get recommendations')
      }
    } catch (err) {
      setError('Network error. Please make sure the backend server is running.')
      console.error('Error:', err)
    }
    setLoading(false)
  }

  // Automatically get recommendations when component mounts
  useEffect(() => {
    getRecommendations(exampleUserData)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-md w-full flex flex-col items-center">
        <h1 className="text-2xl mb-4">Featured Schemes</h1>
        
        {loading && (
          <div className="text-blue-600 mb-4">Analyzing your details...</div>
        )}
        
        {error && (
          <div className="text-red-600 mb-4">{error}</div>
        )}
        
        {!loading && !error && recommendedSchemes.length > 0 && (
          <div className="w-full">
            <h2 className="text-lg font-semibold mb-3">
              Recommended Schemes for {userName}
            </h2>
            <div className="border-2 border-green-400 p-4 rounded-lg">
              {recommendedSchemes.map((scheme, index) => (
                <div key={index} className="mb-3 last:mb-0">
                  <h3 className="font-semibold text-green-800">
                    {index + 1}. {scheme.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {scheme.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!loading && !error && recommendedSchemes.length === 0 && (
          <div className="text-gray-600">
            No schemes recommended based on current criteria.
          </div>
        )}
        
        {/* Optional: Add a refresh button */}
        <button
          onClick={() => getRecommendations(exampleUserData)}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Refresh Recommendations
        </button>
      </div>
    </div>
  )
}