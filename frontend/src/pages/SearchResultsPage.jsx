import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import UserCardTwo from "../components/elements/UserCardTwo";

const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResultsPage = () => {
  const queryParams = useQueryParams();
  const query = queryParams.get("query");

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["searchResults", query],
    queryFn: () => axiosInstance.get(`/search?query=${query}`),
    enabled: !!query,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='hidden lg:block lg:col-span-1'>
        <Sidebar user={authUser} />
      </div>

      <div className='col-span-1 lg:col-span-3'>
        <h1 className='text-2xl font-bold mb-4'>Resultados de búsqueda para "{query}"</h1>
        
        <div className='mb-6'>
          <h2 className='text-xl font-semibold mb-2'>Usuarios</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {searchResults?.data?.users?.length > 0 ? (
              searchResults.data.users.map((user) => (
                <UserCardTwo key={user._id} user={user} isConnection={true} />
              ))
            ) : (
              <p>No se encontraron usuarios.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className='text-xl font-semibold mb-2'>Publicaciones</h2>
          {searchResults?.data?.posts?.length > 0 ? (
            searchResults.data.posts.map((post) => (
              <Post key={post._id} post={post} />
            ))
          ) : (
            <p>No se encontraron publicaciones.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;