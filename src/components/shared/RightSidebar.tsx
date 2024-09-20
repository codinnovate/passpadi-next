// import { currentUser } from "@clerk/nextjs";

import { preps } from "@/constants";
import ExamPreps from "../UI/ExamPreps";

// import UserCard from "../cards/UserCard";

// import { fetchCommunities } from "@/lib/actions/community.actions";
// import { fetchUsers } from "@/lib/actions/user.actions";

async function RightSidebar() {
  // const user = await currentUser();
  // if (!user) return null;

  // const similarMinds = await fetchUsers({
  //   userId: user.id,
  //   pageSize: 4,
  // });

  // const suggestedCOmmunities = await fetchCommunities({ pageSize: 4 });

  return (
    <section className='custom-scrollbar rightsidebar'>
      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1'>
          Suggested Communities
        </h3>

        <div className='mt-7 flex w-[350px] flex-col gap-9'>
         
          <div className="w-full md:w-2/5  flex flex-col h-screen p-2  md:mt-0 ">
          <h1 className="text-xl font-semibold capitalize ">
          Prepare for an Exam 
          </h1>

          <div className="flex w-full flex-col mt-[1em] gap-[1em]">
            {preps.map((item, idx) => (
              <ExamPreps
              key={idx} 
              exam = {item}

              />
            ))}
          </div>

            
          </div>
        </div>


      </div>

      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1'>Similar Minds</h3>


        {/* <div className='mt-7 flex w-[350px] flex-col gap-10'>
          {similarMinds.users.length > 0 ? (
            <>
              {similarMinds.users.map((person) => (
                <UserCard
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  username={person.username}
                  imgUrl={person.image}
                  personType='User'
                />
              ))}
            </>
          ) : (
            <p className='!text-base-regular text-light-3'>No users yet</p>
          )}
        </div> */}


      </div>
    </section>
  );
}

export default RightSidebar;
