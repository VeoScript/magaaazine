import ClientComponent from "~/components/ClientComponent";
import ServerComponent from "~/components/ServerComponent";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center w-full h-screen gap-y-5">
      <h1 className="font-bold text-xl">Welcome to Magaaazine.</h1>
      <ClientComponent />
      <ServerComponent />
    </main>
  );
}
