// components/SpaProfile.jsx
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useLoginModal from "@/app/hooks/useLoginModal";
import { getSession } from "next-auth/react";
import ReviewsDisplay from "./ReviewsDisplay";
import CardGridReview from "../CardGridReview";
import ReviewsInput from "../ReviewsInput";
import Load from "../Load";
import Container from "../Container";
import ReactStars from "react-stars";
import toast from "react-hot-toast";

const SpaProfile = ({ CurrentUser }) => {
  const router = useRouter();
  const [spa, setSpa] = useState(null);
  const [loading, setLoading] = useState(true);
  const loginModal = useLoginModal();
  const searchParams = useSearchParams();
  const search = searchParams.get("listingId");
  //const userId = searchParams.get('user');
  const [data, setData] = useState(null);
  const [data2, setData2] = useState(null);
  const [therapist, setTherapist] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [submitPressed, setSubmitPressed] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [user, setUser] = useState("");

  const [overallRatings, setOverallRatings] = useState(0);
  const [ratingCounts, setRatingCounts] = useState(0);
  const [rating, setRating] = useState(0);
  const handleStarClick = async (nextValue, prevValue, name) => {
    setRating(nextValue);
    try {
      const response = await fetch("/api/addratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spaId: search,
          userId: CurrentUser.id,
          rating: nextValue,
        }),
      });

      if (response.ok) {
        toast.success("New Rating Submitted");
        setSubmitPressed(true);
      } else {
        console.error("Failed to submit ratings");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const toggleReviews = () => {
    setShowReviews(!showReviews);
  };

  useEffect(() => {
    const fetchType = async () => {
      const session = await getSession();

      if (session) {
        const user1 = session.user;
        try {
          const response = await fetch(`/api/currentuser/${CurrentUser?.id}`);
          const Data = await response.json();

          console.log(Data.email);
          console.log("qweqwe");

          setUser(Data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      }
    };
    fetchType();
  }, [CurrentUser?.id]);

  useEffect(() => {
    const fetchSpa = async () => {
      const session = await getSession();
      if (session) {
        try {
          const response = await fetch(
            `/api/spa/${search}?currentUser=${CurrentUser?.id}`
          );
          const spaData = await response.json();

          setSpa(spaData);
          setReviews(spaData.reviews);
          setRatingCounts(spaData.ratingCounts);
          setOverallRatings(spaData.totalRatings);
          setRating(spaData?.currentUserRating?.ratings);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching spa data:", error);
          setLoading(false);
        }
      } else {
        router.push("/spa");
      }
    };
    // Fetch spa data initially
    fetchSpa();
    // Set interval to fetch spa data every 1 seconds
    const interval = submitPressed && setInterval(fetchSpa, 1000);
    setSubmitPressed(false);

    // Cleanup function to clear interval when component unmounts or changes
    return () => clearInterval(interval);
  }, [search, submitPressed, CurrentUser?.id]);

  useEffect(() => {
    const fetchType = async () => {
      if (CurrentUser) {
        try {
          const response = await fetch(`/api/bookdetail/${CurrentUser?.id}`);
          const Data = await response.json();

          setData(Data.booking);
          setData2(Data.spa);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching massage data:", error);
          setLoading(false);
        }
      }
    };
    fetchType();
  }, [CurrentUser?.id]);

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        const response = await fetch(`/api/searchTherapist/${search}`);
        const Data = await response.json();

        setTherapist(Data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching therapist data:", error);
        setLoading(false);
      }
    };
    fetchTherapist();
  }, [search]);

  const handleClick = async (spa) => {
    const session = await getSession();
    if (!session) {
      // Show the login modal if no session
      loginModal.onOpen();
    } else {
      // Proceed to the route with session information
      if (data) {
        router.push(`/bookdetails`);
      } else {
        router.push(`/bookform?listingId=${search}`);
      }
    }
  };

  const handleApplicationForm = async () => {
    router.push(`applicationform?ID=${spa?.spa?.id}`);
  };

  if (loading) {
    return <Load />;
  }

  return (
    <Container>
      <div className="pt-20 flex justify-center">
        {spa?.spa ? (
          <div className="flex flex-col items-center justify-center mx-auto sm:mx-2">
            <h1 className="text-3xl p-5">{spa?.spa?.name}</h1>
            <ReactStars
              value={overallRatings}
              count={5}
              size={24}
              edit={false}
              color2={"#ffd700"}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-9/12 border border-gray-300 border-b-gray-800 rounded-lg overflow-hidden">
              <img
                className="md:col-span-1 h-fit w-full object-cover"
                src={spa?.spa?.image || "/images/placeholder.jpg"}
                alt="image"
              />
              <div className="md:col-span-2 p-4">
                <p className="text-gray-900 mb-8">
                  Discover a new level of relaxation at &quot;{spa?.spa?.name}
                  &quot;, where blind masseurs redefine the massage experience.
                  Let heightened senses guide you through personalized sessions,
                  creating a unique and immersive escape. Welcome to a world
                  where touch is a transformative journey towards unparalleled
                  serenity.
                </p>
                <div className="text-md flex gap-2">
                  Contact Number:{" "}
                  <div className="font-light text-md text-neutral-500 mb-3">
                    {spa?.spa?.phoneNum}
                  </div>
                </div>
                <div className=" text-md  mb-3 flex gap-2">
                  Address:
                  <div className="font-light text-md text-neutral-500 mb-3">
                    {spa?.spa?.address}
                  </div>
                </div>
                <div className="items-center gap-1 mb-3">
                  <div className="font-semibold">
                    Overall Ratings - {overallRatings?.toFixed(2)}(
                    {ratingCounts} Reviews)
                  </div>
                  {CurrentUser && (
                    <div className="flex">
                      <p className="my-auto">rate here</p>
                      <ReactStars
                        value={rating}
                        onChange={(nextValue, prevValue, name) =>
                          handleStarClick(nextValue, prevValue, name)
                        }
                        count={5}
                        size={24}
                        color2={"#ffd700"}
                      />
                    </div>
                  )}
                </div>
                <div>
                  {therapist ? (
                    <div>
                      {data?.userId === CurrentUser?.id &&
                      data?.spaId === spa?.spa?.id ? (
                        <button
                          className="bg-amber-800 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => handleClick(spa)}
                        >
                          You have an existing booking
                        </button>
                      ) : (
                        <div className="p-2">
                          <button
                            className="bg-amber-800 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 underline-offset-1"
                            onClick={() => handleClick(spa)}
                          >
                            Book Here
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <button className="bg-stone-400 text-white font-bold py-2 px-4 rounded">
                        Unavailable right now
                      </button>
                      <p className="font-light text-sm text-neutral-500 mb-3">
                        Sorry, there is no available therapist right now. Please
                        come back later.
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center md:w-1/3 md:ml-auto">
                  <div className="w-full">
                    <p className="font-light text-sm text-neutral-500">
                      If you have a friend or family member that is visually
                      impaired and is willing to be one of our therapists, you
                      can help them apply here.
                    </p>
                    <button
                      className=""
                      onClick={() => handleApplicationForm()}
                    >
                      <p className="hover:underline underline-offset-1 text-blue-500">
                        Click Here To Apply
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-5xl mt-8">
              <h1 className="font-semibold text-lg">Reviews:</h1>
              <CardGridReview reviews={reviews} />
            </div>

            <div className="w-full max-w-5xl mt-4">
              <div className="text-right text-blue-500 hover:underline">
                <button onClick={toggleReviews}>
                  {showReviews ? "Hide Reviews" : "Show More Reviews"}
                </button>
              </div>
              {showReviews && (
                <ReviewsDisplay
                  reviews={reviews}
                  CurrentUser={CurrentUser}
                  spaId={search}
                  setSubmitPressed={setSubmitPressed}
                />
              )}
            </div>

            <div className="w-full max-w-5xl mt-8 pb-6">
              {CurrentUser && (
                <ReviewsInput
                  spaId={search}
                  userId={user?.id}
                  setSubmitPressed={setSubmitPressed}
                />
              )}
            </div>
          </div>
        ) : (
          <div>No spa data found</div>
        )}
      </div>
    </Container>
  );
};

export default SpaProfile;
