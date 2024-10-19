
import BookDetails from '../components/BookDetails'
import getCurrentUser from '../actions/getCurrentUser'

const details = async () => {
  const currentUser = await getCurrentUser();

  return (
    <>
      <BookDetails currentUser={currentUser}/>
    </>
  )
}

export default details