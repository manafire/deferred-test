import { Suspense } from 'react'; // <-- using Suspense
import type { LoaderArgs } from '@remix-run/node';
import { defer } from '@remix-run/node'; // <-- using a special defer function
import { Await, useLoaderData } from '@remix-run/react'; // <-- using an Await component

// import { getPackageLocation } from "~/models/packages";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function loader({ params }: LoaderArgs) {
  // NOTE: getPackageLocation returns a promise, but we're *not* awaiting it!!
  // const packageLocationPromise = getPackageLocation(params.packageId);
  const packageLocationPromise = sleep(10000);

  return defer({
    packageLocation: packageLocationPromise, // <-- we pass a promise to defer
  });
}

export default function PackageRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <main>
      <h1>Let's locate your package</h1>
      <Suspense fallback={<p>Loading package location... LOADING</p>}>
        <Await
          // PROMISE TELEPORTATION OVER THE NETWORK!
          resolve={data.packageLocation} // <-- this is a promise!
          errorElement={<p>Error loading package location!</p>}
        >
          {/* Render props are back! */}
          {(packageLocation) => (
            <p>Promise has resolved!</p>
            // <p>
            //   Your package is at {packageLocation.latitude} lat and{' '}
            //   {packageLocation.longitude} long.
            // </p>
          )}
        </Await>
      </Suspense>
    </main>
  );
}
