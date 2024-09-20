import Link from "next/link";



function Topbar() {
  return (
    <nav className='topbar border'>
      <Link href='/'>
        <h1 className="text-center font-bold text-3xl">PassPadi</h1>
      </Link>
    </nav>
  );
}

export default Topbar;
