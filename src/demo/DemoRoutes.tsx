// Hele demoen samlet ét sted, så den kan hentes som sin egen chunk.
// App.tsx loader denne fil med React.lazy – ellers ville alle besøgende på det
// rigtige site betale for demoens kode (bl.a. recharts) uden at bruge den.

import { Navigate, Route, Routes } from "react-router-dom";
import { DemoProvider } from "./store";
import DemoLayout from "./site/DemoLayout";
import DemoHome from "./site/DemoHome";
import DemoGallery from "./site/DemoGallery";
import DemoWorkshop from "./site/DemoWorkshop";
import DemoContact from "./site/DemoContact";
import DemoPortalLayout from "./portal/DemoPortalLayout";
import DemoPortalDashboard from "./portal/DemoPortalDashboard";
import DemoPortalInbox from "./portal/DemoPortalInbox";
import DemoPortalOrders from "./portal/DemoPortalOrders";

const site = (children: React.ReactNode) => <DemoLayout>{children}</DemoLayout>;
const portal = (children: React.ReactNode) => <DemoPortalLayout>{children}</DemoPortalLayout>;

export default function DemoRoutes() {
  return (
    <DemoProvider>
      <Routes>
        <Route path="portal" element={portal(<DemoPortalDashboard />)} />
        <Route path="portal/indbakke" element={portal(<DemoPortalInbox />)} />
        <Route path="portal/ordrer" element={portal(<DemoPortalOrders />)} />

        <Route path="" element={site(<DemoHome />)} />
        <Route path="galleri" element={site(<DemoGallery />)} />
        <Route path="vaerksted" element={site(<DemoWorkshop />)} />
        <Route path="kontakt" element={site(<DemoContact />)} />

        <Route path="*" element={<Navigate to="/demo" replace />} />
      </Routes>
    </DemoProvider>
  );
}
