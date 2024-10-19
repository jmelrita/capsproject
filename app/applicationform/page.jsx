import ApplicationForm from "../components/ApplicationForm";
import { Suspense } from "react";

function SearchBarFallback() {
  return <>placeholder</>;
}

const page = () => {
  return (
    <>
      <Suspense fallback={<SearchBarFallback />}>
        <ApplicationForm />
      </Suspense>
      
    </>
  );
};

export default page;
