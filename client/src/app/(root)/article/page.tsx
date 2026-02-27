// import LatestArticles from "@/components/LatestArticles";

async function page ({params}:{params:Promise<{id:string}>}) {
    const { id } = await params;
    return (
        <div className="">
           {id}
           {/* <LatestArticles  /> */}
        </div>
    )
}

export default page;