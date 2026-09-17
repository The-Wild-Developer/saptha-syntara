import ForceLightMode from "@/components/common/ForceLightMode";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ForceLightMode>{children}</ForceLightMode>;
}
