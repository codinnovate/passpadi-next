import { fetchLatestArticles} from '@/app/actions';
import LastestCard from './LastestCard';

async function LatestArticles() {
  const data = await fetchLatestArticles(); // Await the async function directly in the server component
  return (
    <section className='flex flex-col h-full'>
      <div className='flex flex-col gap-1 mb-[2em]'>
       <h1 className='text-gray-400 font-medium text-sm'>THIS WEEK&apos;s</h1>
      <h1 className='text-xl font-extrabold'>Latest Articles</h1>
      </div>

      <div className='flex flex-col w-full  gap-5'>
        {data && data?.slice(0, 4).map((item, idx) => (
          <LastestCard 
          blog={item}
           key={idx} />  // Display the data with the LastestCard component
        ))}
      </div>
    </section>
  );
}

export default LatestArticles;
