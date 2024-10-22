"use client"; 
const ErrorPage = ({ statusCode }) => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-6xl font-bold text-red-600">
          {statusCode ? `${statusCode} - Error` : 'Error'}
        </h1>
        <h2 className="mt-4 text-2xl">Something went wrong</h2>
        <p className="mt-2">
          We encountered an error while processing your request. Please try again later.
        </p>
      </div>
    );
  };
  
  // Use getServerSideProps to retrieve the status code for the error page
  export async function getServerSideProps({ res }) {
    const statusCode = res ? res.statusCode : 404;
    return { props: { statusCode } };
  }
  
  export default ErrorPage;
  