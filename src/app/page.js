"use client"

import VoteComponent from "./component/VoteComponent";

export default function Home() {
  
    const questions = [
    {
      question: "Nolz doit il partir ?",
      options: [
        { id: "1", text: "Oui, je t'achète le billet aller simple vers bamako" },
        { id: "2", text: "Non miskine je l'aime bien" },
      ]
    }
  ];

  return (
     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Vote jadox</h1>
          <p className="text-gray-600">Ici des jugement son prononcé</p>
        </div>
        <VoteComponent questions={questions} />
      </div>
    </div>
  );
}