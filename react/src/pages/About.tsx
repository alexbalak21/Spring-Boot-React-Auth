export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900">About Us</h1>
          <p className="mt-1 max-w-2xl text-lg text-gray-500">
            Learn more about our application and mission.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-lg font-medium text-gray-500">Our Mission</dt>
              <dd className="mt-1 text-lg text-gray-900 sm:mt-0 sm:col-span-2">
                To build amazing web applications with clean, maintainable code and exceptional user experiences.
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-lg font-medium text-gray-500">Our Vision</dt>
              <dd className="mt-1 text-lg text-gray-900 sm:mt-0 sm:col-span-2">
                To empower developers and businesses through innovative technology solutions.
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-lg font-medium text-gray-500">Technologies</dt>
              <dd className="mt-1 text-lg text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="list-disc pl-5 space-y-2">
                  <li>React with TypeScript</li>
                  <li>Tailwind CSS for styling</li>
                  <li>Modern web standards and best practices</li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
        <div className="bg-gray-50 px-4 py-4 sm:px-6 text-right">
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
