import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "XPadel" },
    { name: "description", content: "Bienvenido a XPadel!" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-5">
      <h1 className="text-4xl">Bienvenido a XPadel</h1>
    </div>
  );
}
