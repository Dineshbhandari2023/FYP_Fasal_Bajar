export default function WelcomeSection() {
  return (
    <div className="bg-[#2F4F2F] text-white p-6 rounded-lg mb-6">
      <h1 className="text-2xl font-bold mb-2">Welcome back, {userName}!</h1>
      <p>Ready to explore today's fresh products from our trusted farmers?</p>
    </div>
  );
}
