export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <div
          className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4"
          style={{ borderColor: '#009fe3', borderTopColor: 'transparent' }}
        ></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
