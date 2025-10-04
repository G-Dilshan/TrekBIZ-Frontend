// import React, { useEffect } from "react";
// // import { Routes, Route, Navigate } from "react-router";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";

// // Auth and Store Routes
// import AuthRoutes from "./routes/AuthRoutes";
// import StoreRoutes from "./routes/StoreRoutes";
// import BranchManagerRoutes from "./routes/BranchManagerRoutes";
// import { getUserProfile } from "./Redux Toolkit/features/user/userThunks";
// import Landing from "./pages/common/Landing/Landing";
// import CashierRoutes from "./routes/CashierRoutes";
// import Onboarding from "./pages/onboarding/Onboarding";
// import { getStoreByAdmin } from "./Redux Toolkit/features/store/storeThunks";
// import SuperAdminRoutes from "./routes/SuperAdminRoutes";
// import PageNotFound from "./pages/common/PageNotFound";

// const App = () => {
//   const dispatch = useDispatch();
//   const { userProfile } = useSelector((state) => state.user);
//   const { store } = useSelector((state) => state.store);

//   useEffect(() => {
//     const jwt = localStorage.getItem("jwt");
//     if (jwt) {
//       dispatch(getUserProfile(jwt));
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     if (userProfile && userProfile.role === "ROLE_STORE_ADMIN") {
//       dispatch(getStoreByAdmin(userProfile.jwt));
//     }
//   }, [dispatch, userProfile]);

//   let content;

//   // console.log("state ", user)

//   if (userProfile && userProfile.role) {
//     // User is logged in
//     if (userProfile.role === "ROLE_ADMIN") {
//       content = (
//         <Routes>
//           <Route path="/" element={<Navigate to="/super-admin" replace />} />
//           <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
//           <Route
//             path="*"
//             element={<PageNotFound/>}
//           />
//         </Routes>
//       );
//     } else if (userProfile.role === "ROLE_BRANCH_CASHIER") {
//       content = (
//         <Routes>
//           <Route path="/" element={<Navigate to="/cashier" replace />} />
//           <Route path="/cashier/*" element={<CashierRoutes />} />
//           <Route
//             path="*"
//             element={<PageNotFound/>}
//           />
//         </Routes>
//       );
//     } else if (
//       userProfile.role === "ROLE_STORE_ADMIN" ||
//       userProfile.role === "ROLE_STORE_MANAGER"
//     ) {
//       // console.log("get inside", store);
//       if (!store) {
//         // console.log("get inside 1");
//         content = (
//           <Routes>
//             <Route path="/auth/onboarding" element={<Onboarding />} />
//             <Route
//               path="*"
//               element={<PageNotFound/>}
//             />
//           </Routes>
//         );
//         return content;
//       } else {
//         // console.log("get inside 2");
//         content = (
//           <Routes>
//             <Route path="/" element={<Navigate to="/store" replace />} />
//             <Route path="/store/*" element={<StoreRoutes />} />
//             <Route
//               path="*"
//               element={<PageNotFound/>}
//             />
//           </Routes>
//         );
//       }
//     } else if (
//       userProfile.role === "ROLE_BRANCH_MANAGER" ||
//       userProfile.role === "ROLE_BRANCH_ADMIN"
//     ) {
//       content = (
//         <Routes>
//           <Route path="/" element={<Navigate to="/branch" replace />} />
//           <Route path="/branch/*" element={<BranchManagerRoutes />} />
//           <Route
//             path="*"
//             element={<PageNotFound/>}
//           />
//         </Routes>
//       );
//     } else {
//       // Unknown role, redirect to landing or error page
//       content = (
//         <Routes>
//           <Route path="/" element={<Landing />} />
//           <Route
//             path="*"
//             element={ <PageNotFound/>}
//           />
//         </Routes>
//       );
//     }
//   } else {
//     // User is not logged in, show landing page and auth routes
//     content = (
//       <Routes>
//         <Route path="/" element={<Landing />} />
//         <Route path="/auth/*" element={<AuthRoutes />} />
//         <Route
//           path="*"
//           element={
//           <PageNotFound/>
//           }
//         />
//       </Routes>
//     );
//   }

//   return content;
// };

// export default App;

import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Routes
import AuthRoutes from "./routes/AuthRoutes";
import StoreRoutes from "./routes/StoreRoutes";
import BranchManagerRoutes from "./routes/BranchManagerRoutes";
import CashierRoutes from "./routes/CashierRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";

// Pages
import Landing from "./pages/common/Landing/Landing";
import Onboarding from "./pages/onboarding/Onboarding";
import PageNotFound from "./pages/common/PageNotFound";

// Thunks
import { getUserProfile } from "./Redux Toolkit/features/user/userThunks";
import { getStoreByAdmin } from "./Redux Toolkit/features/store/storeThunks";

const App = () => {
  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.user);
  const { store } = useSelector((state) => state.store);

  const [isLoading, setIsLoading] = useState(true);

  // Load user profile on mount
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(getUserProfile(jwt))
        .finally(() => setIsLoading(false)); // done loading
    } else {
      setIsLoading(false);
    }
  }, [dispatch]);

  // Fetch store for store admins
  useEffect(() => {
    if (userProfile && userProfile.role === "ROLE_STORE_ADMIN") {
      dispatch(getStoreByAdmin(userProfile.jwt));
    }
  }, [dispatch, userProfile]);

  // Show a loader until the user profile is fetched
  if (isLoading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          fontWeight: "500",
        }}
      >
        Loading...
      </div>
    );
  }

  let content;

  // If user is logged in and has a role
  if (userProfile && userProfile.role) {
    switch (userProfile.role) {
      case "ROLE_ADMIN":
        content = (
          <Routes>
            <Route path="/" element={<Navigate to="/super-admin" replace />} />
            <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        );
        break;

      case "ROLE_BRANCH_CASHIER":
        content = (
          <Routes>
            <Route path="/" element={<Navigate to="/cashier" replace />} />
            <Route path="/cashier/*" element={<CashierRoutes />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        );
        break;

      case "ROLE_STORE_ADMIN":
      case "ROLE_STORE_MANAGER":
        if (!store) {
          content = (
            <Routes>
              <Route path="/auth/onboarding" element={<Onboarding />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          );
        } else {
          content = (
            <Routes>
              <Route path="/" element={<Navigate to="/store" replace />} />
              <Route path="/store/*" element={<StoreRoutes />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          );
        }
        break;

      case "ROLE_BRANCH_MANAGER":
      case "ROLE_BRANCH_ADMIN":
        content = (
          <Routes>
            <Route path="/" element={<Navigate to="/branch" replace />} />
            <Route path="/branch/*" element={<BranchManagerRoutes />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        );
        break;

      default:
        content = (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        );
        break;
    }
  } else {
    // Not logged in
    content = (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    );
  }

  return content;
};

export default App;
