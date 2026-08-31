export default function Home() {
  return (
    <article>
      <header className="mb-12 border-b border-gray-100 pb-8">
        <h2 className="text-3xl font-semibold tracking-tight mb-3">Welcome to the Dashboard</h2>
        <p className="text-gray-500">This is a clean, minimal interface using Inter.</p>
      </header>

      <section className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-sm">Action item {i}</p>
                  <p className="text-sm text-gray-500">Completed 2 hours ago</p>
                </div>
                <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
                  View details
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4 text-[#171717]">Select a Guideline</h3>
          <div className="text-gray-600 text-base leading-relaxed space-y-4">
            <p>
              Please select an evaluation criterion from the sidebar to view its detailed guidelines, exhibits, and context to be observed.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
