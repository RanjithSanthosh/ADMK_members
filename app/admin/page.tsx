// // app/admin/page.tsx

// import Link from 'next/link';

// // Define the shape of our data
// interface SheetRow {
//   Timestamp: string;
//   FullName: string;
//   PhoneNumber: string;
//   Constituency: string;
//   PartyRole: string;
//   [key: string]: any; // Allow other keys
// }

// // 1. Fetches data on the server, not the client
// async function getData(): Promise<SheetRow[]> {
//   const scriptUrl = process.env.GOOGLE_SHEET_WEB_APP_URL;

//   if (!scriptUrl) {
//     throw new Error("Google Sheet Web App URL is not defined");
//   }

//   try {
//     // We use 'no-store' to ensure we always get the latest data
//     const res = await fetch(scriptUrl, { cache: 'no-store' });

//     if (!res.ok) {
//       throw new Error(`Failed to fetch data: ${res.statusText}`);
//     }

//     const json = await res.json();

//     if (json.result !== 'success') {
//       throw new Error(`API returned an error: ${json.error}`);
//     }

//     return json.data as SheetRow[];

//   } catch (error) {
//     console.error("Error fetching data:", error);
//     // Return an empty array on error so the page can still render
//     return [];
//   }
// }

// // 2. This is a Server Component
// export default async function AdminPage() {
//   const data = await getData();

//   // Get all unique headers from the first row (or fallback)
//   const headers = data.length > 0 ? Object.keys(data[0]) : [];

//   return (
//     <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
//       <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-party-green">
//             Admin Dashboard 
//           </h1>
//           {/* <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//             Go to Form
//           </Link> */}
//         </div>

//         {/* 3. The Table for displaying data */}
//         <div className="overflow-x-auto">
//           {data.length > 0 ? (
//             <table className="min-w-full divide-y divide-gray-200 border">
//               <thead className="bg-gray-50">
//                 <tr>
//                   {headers.map((header) => (
//                     <th
//                       key={header}
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       {header}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {data.map((row, rowIndex) => (
//                   <tr key={rowIndex}>
//                     {headers.map((header) => (
//                       <td
//                         key={header}
//                         className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
//                       >
//                         {row[header]}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p className="text-center text-gray-500">
//               No data found or failed to load.
//             </p>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }

// app/admin/page.tsx

import Link from 'next/link';
import AdminTable from './AdminTable'; // We will create this component

// Define the shape of our data
// We added the new 'Union' field
interface SheetRow {
  Timestamp: string;
  FullName: string;
  PhoneNumber: string;
  Union: string; // <-- Added Union
  Constituency: string;
  PartyRole: string;
  [key: string]: any;
}

// 1. Fetches data on the server
async function getData(): Promise<SheetRow[]> {
  const scriptUrl = process.env.GOOGLE_SHEET_WEB_APP_URL;

  if (!scriptUrl) {
    console.error("Google Sheet Web App URL is not defined");
    return []; // Return empty on config error
  }

  try {
    const res = await fetch(scriptUrl, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }

    const json = await res.json();

    if (json.result !== 'success') {
      throw new Error(`API returned an error: ${json.error}`);
    }

    // The data is already formatted by our Apps Script, including the Timestamp
    return json.data as SheetRow[];

  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array on fetch error
  }
}

// 2. This is a Server Component that passes data to the Client Component
export default async function AdminPage() {
  const data = await getData();

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 
            className="text-3xl font-bold"
            style={{ color: '#0B9421' }} // Use inline style for your green
          >
           நிர்வாக முகப்பு
          </h1>
          {/* <Link 
            href="/" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Form
          </Link> */}
        </div>
        
        {/* Pass the server-fetched data to the client component.
          This is the best practice for performance.
        */}
        <AdminTable initialData={data} />
        
      </div>
    </main>
  );
}