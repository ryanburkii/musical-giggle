import { TravelChatbot } from "@/components/TravelChatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
          Travel Planning Assistant
        </h1>
        <TravelChatbot />
      </div>
    </div>
  );
};

export default Index;