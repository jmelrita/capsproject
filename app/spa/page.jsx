
import ClientOnly from "../components/ClientOnly";
import Container from "../components/Container";
import ListingCard from "../components/listings/ListingCard";
import getListings from "../actions/getListings";
import getCurrentUser from "../actions/getCurrentUser";

const Spa = async () => {
  // let listings = [1,2,3,4,5];
  let listings = await getListings();
  if (listings.length == 0) {
    return null;
  }
  const currentuser = await getCurrentUser();
  return (
    <ClientOnly>
      <Container>
        <div
          className="
            pt-24
            grid
            grid-rows-1
            w-full
            gap-8
            pb-24
          "
        >
          <ListingCard listings={listings} currentuser={currentuser} />      
        </div>
      </Container>
    </ClientOnly>
  )
};

export default Spa;