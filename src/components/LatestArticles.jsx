import { fetchLatestArticles } from '@/app/actions';
import LastestCard from './LastestCard';

async function LatestArticles() {
  let data;
  try {
    data = await fetchLatestArticles();
  } catch (error) {
    console.error('Error fetching articles:', error);
    data = [];
  }

  // Ensure data is an array before using slice
  const articles = Array.isArray(data) ? data : [];

  return (
    <section className='flex flex-col h-full'>
      <div className='flex flex-col gap-1 mb-[2em]'>
        <h1 className='text-gray-400 font-medium text-sm'>THIS WEEK&apos;s</h1>
        <h1 className='text-xl font-extrabold'>Latest Articles</h1>
      </div>

      <div className='flex flex-col w-full gap-5'>
        {articles.length > 0 ? (
          articles.slice(0, 4).map((item, idx) => (
            <LastestCard 
              blog={item}
              key={idx} 
            />
          ))
        ) : (
          <p>No articles available.</p> // Handle case where no articles are present
        )}
      </div>
    </section>
  );
}

export default LatestArticles;
