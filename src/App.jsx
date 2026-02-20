export default function App() {
  return (
    <div className="p-10 space-y-4">
      <h1 className="text-3xl font-bold">
        DaisyUI test
      </h1>

      {/* DaisyUI button */}
      <button className="btn btn-primary">
        Primary Button
      </button>

      {/* DaisyUI alert */}
      <div className="alert alert-success">
        <span>DaisyUI is working 🌼</span>
      </div>

      {/* DaisyUI loader */}
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  )
}
