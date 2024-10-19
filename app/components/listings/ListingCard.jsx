"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Button from "../Button";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import toast from "react-hot-toast";
import useLoginModal from "@/app/hooks/useLoginModal";
import ReactStars from 'react-stars';

const ListingCard = ({ listings, currentuser }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const loginModal = useLoginModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredListings, setFilteredListings] = useState(listings);

  const handleDiscoveryClick = async (listingId) => {
    const session = await getSession();
    if (!session) {
      // Show the login modal if no session
      loginModal.onOpen();
    } else {
      router.push(`/spaProfile?listingId=${listingId}`);
    }
  };

  useEffect(() => {
    const fetchType = async () => {
      const session = await getSession();
      if (session) {
        const user1 = session.user;
        try {
          const response = await fetch(`/api/currentuser/${currentuser?.id}`);
          const Data = await response.json();

          setUser(Data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching massage data:", error);
          setLoading(false);
        }
      }
    };
    fetchType();
  }, [currentuser?.id]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = listings?.filter((listing) =>
      listing.name.toLowerCase().includes(query)
    );
    setFilteredListings(filtered);
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={handleSearch}
        className="
        
        w-full
        md:w-full
        lg:w-full
        xl:w-2/3
        2xl:w-2/3
        mx-auto 
        h-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline shadow appearance-none border-2 border-[#c7b198] rounded"
      />
      <div
        className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            2xl:grid-cols-5
          group
          gap-5
        "
      >
        {filteredListings?.map((listing) => (
          <div
            key={listing.id}
            className="
          grid
            grid-cols-1
          cursor-pointer
          group
        "
            onClick={() => handleDiscoveryClick(listing?.id)}
          >
            <div
              className="
            flex 
            flex-col 
            gap-2
            w-full
          "
            >
              <div
                className="
              aspect-square
              w-full
              relative
              overflow-hidden
              rounded-xl
            "
              >
                <Image
                  fill
                  alt="listing"
                  src={listing?.image || "/images/logo.png"}
                  className="
                object-cover
                h-full
                w-full
                hover:scale-110
                transition
              "
                />
                {/* Heart Button here */}
              </div>
              <div className="h-36">
                <div className="font-bold text-lg">{listing?.name}</div>
                <div className="font-light text-neutral-500">
                  {listing?.desc}
                </div>
                <div className="font-light text-sm text-neutral-500">
                  {listing?.address}
                </div>
              </div>
              <div className="flex flex-row items-center gap-1">
                <div className="font-semibold">
                  Rating - {(listing?.averageRating).toFixed(2)}(
                  {listing?.ratingCounts} Reviews)
                  <ReactStars
                    value={listing?.averageRating}
                    count={5}
                    size={24}
                    edit={false}
                    color2={"#ffd700"}
                  />
                </div>
              </div>

              <Button
                disabled={false}
                small
                label={"Discover"}
                onClick={() => handleDiscoveryClick(listing?.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListingCard;
