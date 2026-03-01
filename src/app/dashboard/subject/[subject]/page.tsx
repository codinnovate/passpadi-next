import SubjectPageClient from "./SubjectPageClient";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = await params;
  return <SubjectPageClient subjectSlug={subject} />;
}
