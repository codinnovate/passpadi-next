// import LatestArticles from "@/components/LatestArticles";

async function page ({params}:{params:{id:string}}) {
    return (
        <div className="">
           {params.id}
           {/* <LatestArticles  /> */}
        </div>
    )
}

export default page;