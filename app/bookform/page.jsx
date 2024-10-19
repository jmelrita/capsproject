import BookForm from "../components/BookingForm";
import { Suspense } from "react";
import getCurrentUser from "../actions/getCurrentUser";

function SearchBarFallback() {
  return <>placeholder</>;
}

const booking = async () => {
  const currentUser = await getCurrentUser();
  return (
    <>
      <Suspense fallback={<SearchBarFallback />}>
        <BookForm currentUser={currentUser} />
      </Suspense>
    </>
  );
};

export default booking;
