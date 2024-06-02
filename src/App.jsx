import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";


function App() {

  return (
    <div>
      <Layout />
      {data && <div>{JSON.stringify(data)}</div>} {/* Display fetched data */}
    </div>
  );
}

export default App;
