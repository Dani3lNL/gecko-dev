/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const { openToolboxAndLog, closeToolboxAndLog, reloadPageAndLog, testSetup,
        testTeardown, COMPLICATED_URL } = require("../head");
const { exportHar, waitForNetworkRequests } = require("./netmonitor-helpers");

const EXPECTED_REQUESTS = 280;

module.exports = async function() {
  await testSetup(COMPLICATED_URL);
  const toolbox = await openToolboxAndLog("complicated.netmonitor", "netmonitor");

  const requestsDone = waitForNetworkRequests("complicated.netmonitor", toolbox,
    EXPECTED_REQUESTS);
  await reloadPageAndLog("complicated.netmonitor", toolbox);
  await requestsDone;

  await exportHar("complicated.netmonitor", toolbox);

  await closeToolboxAndLog("complicated.netmonitor", toolbox);

  // After switching TabClient to a Front, DAMP became frequently intermittent on
  // windows pgo builds (https://bugzilla.mozilla.org/show_bug.cgi?id=1480953).
  // Pausing before switching to the next test seems to fix the issue.
  await new Promise(r => setTimeout(r, 1000));

  await testTeardown();
};
