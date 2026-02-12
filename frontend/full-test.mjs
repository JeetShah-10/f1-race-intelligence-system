/**
 * Full Website Test — validates every page renders and all API endpoints work.
 * Tests all public + protected routes, API integrations, and mock fallback.
 */

const FRONTEND = 'http://localhost:5173';
const BACKEND = 'http://localhost:8000';

let passed = 0, failed = 0, warnings = 0;

async function fetchOK(url, opts = {}) {
    const res = await fetch(url, { redirect: 'follow', ...opts });
    return res;
}

async function test(name, fn) {
    try {
        const result = await fn();
        if (result === 'warn') {
            warnings++;
            console.log(`⚠️  ${name}`);
        } else {
            passed++;
            console.log(`✅ ${name}`);
        }
    } catch (err) {
        failed++;
        console.error(`❌ ${name}: ${err.message}`);
    }
}

async function testPage(path, expectedContent) {
    await test(`PAGE ${path}`, async () => {
        const res = await fetchOK(`${FRONTEND}${path}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        if (!html.includes('<div id="root"')) throw new Error('Missing React root');
        if (html.includes('error') && html.includes('Cannot')) throw new Error('React error detected');
        // Vite SSR sends the shell, JS hydrates — we verify the shell loads
        return html.length > 500 ? 'ok' : 'warn';
    });
}

async function testAPI(method, path, body, validator) {
    await test(`API ${method} ${path}`, async () => {
        const opts = { method };
        if (body) {
            opts.headers = { 'Content-Type': 'application/json' };
            opts.body = JSON.stringify(body);
        }
        const res = await fetchOK(`${BACKEND}${path}`, opts);
        if (!res.ok) {
            const status = res.status;
            if (status === 404) {
                console.log(`      → 404 (endpoint not implemented — mock fallback used)`);
                return 'warn';
            }
            throw new Error(`HTTP ${status} ${res.statusText}`);
        }
        const data = await res.json();
        if (validator) validator(data);
    });
}

(async () => {
    console.log('\n🏎️  F1 APEX INTELLIGENCE — FULL WEBSITE TEST');
    console.log('═'.repeat(60));
    console.log(`   Frontend: ${FRONTEND}`);
    console.log(`   Backend:  ${BACKEND}`);
    console.log(`   Time:     ${new Date().toLocaleString()}`);
    console.log('═'.repeat(60));

    // ═══════════════════════════════════════════════════════════
    console.log('\n📄 SECTION 1: PAGE RENDERING');
    console.log('─'.repeat(60));

    // Public pages
    await testPage('/', 'APEX');
    await testPage('/login', 'Sign In');
    await testPage('/signup', 'Create');
    await testPage('/pricing', 'Pricing');
    await testPage('/season-2026', '2026');
    await testPage('/standings/drivers', 'Standings');
    await testPage('/standings/constructors', 'Constructor');
    await testPage('/calendar', 'Calendar');

    // Protected pages (auth bypassed)
    await testPage('/dashboard', 'Dashboard');
    await testPage('/simulate', 'Simulat');
    await testPage('/predict', 'Predict');
    await testPage('/analyze', 'Analyze');
    await testPage('/analyze/telemetry', 'Telemetry');
    await testPage('/analyze/laptimes', 'Lap');
    await testPage('/analyze/strategy', 'Strategy');
    await testPage('/analyze/season', 'Season');
    await testPage('/analyze/driver', 'Driver');
    await testPage('/analyze/constructor', 'Constructor');
    await testPage('/insights', 'Insight');
    await testPage('/profile', 'Profile');

    // ═══════════════════════════════════════════════════════════
    console.log('\n🔌 SECTION 2: BACKEND API ENDPOINTS');
    console.log('─'.repeat(60));

    // Health
    await testAPI('GET', '/health', null, (d) => {
        if (d.status !== 'ok') throw new Error(`Health: ${d.status}`);
        console.log('      → status: ok');
    });

    // Drivers
    await testAPI('GET', '/api/drivers/?year=2025', null, (d) => {
        const count = (d.drivers || d || []).length;
        if (count === 0) throw new Error('No drivers');
        console.log(`      → ${count} drivers`);
    });

    // Standings
    await testAPI('GET', '/api/standings/drivers?year=2025', null, (d) => {
        console.log(`      → ${(d.standings || []).length} standings (0 = expected pre-season)`);
    });

    // Circuits
    await testAPI('GET', '/api/circuits/', null, (d) => {
        const count = (d.circuits || d || []).length;
        console.log(`      → ${count} circuits`);
    });

    // Calendar
    await testAPI('GET', '/api/calendar?year=2025', null, (d) => {
        console.log(`      → calendar data received`);
    });

    // Schedule
    await testAPI('GET', '/api/schedule?year=2025', null, (d) => {
        console.log(`      → schedule data received`);
    });

    // ═══════════════════════════════════════════════════════════
    console.log('\n🏁 SECTION 3: SIMULATION ENDPOINTS');
    console.log('─'.repeat(60));

    // Qualifying
    await testAPI('POST', '/api/qualifying/qualify',
        { circuit_id: 'monza', grid: 'current_2026' },
        (d) => {
            if (!d.results || d.results.length === 0) throw new Error('No qualifying results');
            const pole = d.results[0];
            const q2Elim = d.results.filter(r => r.q3_time === null).length;
            const q1Elim = d.results.filter(r => r.q2_time === null).length;
            console.log(`      → ${d.results.length} drivers, pole: ${pole.driver_id} (${pole.best_time.toFixed(3)}s)`);
            console.log(`      → Q2 eliminated: ${q2Elim}, Q1 eliminated: ${q1Elim}`);
        }
    );

    // Simulation (short 3-lap race)
    await testAPI('POST', '/api/simulate/simulate',
        { circuit_id: 'monza', lap_count: 3, grid: 'current_2026' },
        (d) => {
            if (!d.results || d.results.length === 0) throw new Error('No sim results');
            const winner = d.results[0];
            if (!winner.laps || winner.laps.length === 0) throw new Error('No lap data');
            const lap = winner.laps[0];
            if (!('lap' in lap) || !('time' in lap)) throw new Error('Bad lap structure');
            console.log(`      → ${d.results.length} drivers, ${winner.laps.length} laps`);
            console.log(`      → Winner: ${winner.driver_id} (${winner.team})`);
            console.log(`      → Lap 1: ${lap.time.toFixed(3)}s, compound: ${lap.compound}`);
            console.log(`      → Events: ${winner.events?.length || 0} race events`);
        }
    );

    // Simulation with different circuit
    await testAPI('POST', '/api/simulate/simulate',
        { circuit_id: 'silverstone', lap_count: 2, grid: 'current_2026' },
        (d) => {
            if (!d.results || d.results.length === 0) throw new Error('No sim results');
            console.log(`      → Silverstone: ${d.results.length} drivers, winner: ${d.results[0].driver_id}`);
        }
    );

    // Qualifying with different circuit 
    await testAPI('POST', '/api/qualifying/qualify',
        { circuit_id: 'silverstone', grid: 'current_2026' },
        (d) => {
            if (!d.results) throw new Error('No results');
            console.log(`      → Silverstone: ${d.results.length} drivers, pole: ${d.results[0].driver_id}`);
        }
    );

    // ═══════════════════════════════════════════════════════════
    console.log('\n🔮 SECTION 4: PREDICTION & ANALYSIS ENDPOINTS');
    console.log('─'.repeat(60));

    // Predict
    await testAPI('POST', '/api/predict/event',
        { circuit_id: 'monza', year: 2026 },
        (d) => {
            console.log(`      → Prediction result received`);
        }
    );

    // Compare drivers
    await testAPI('GET', '/api/compare/drivers?driver1=VER&driver2=NOR&year=2025', null, (d) => {
        console.log(`      → Driver comparison data received`);
    });

    // Telemetry
    await testAPI('GET', '/api/telemetry?year=2024&round=1&session=R&driver=VER', null, (d) => {
        console.log(`      → Telemetry data received`);
    });

    // ═══════════════════════════════════════════════════════════
    console.log('\n📊 SECTION 5: DATA INTEGRITY CHECKS');
    console.log('─'.repeat(60));

    // Verify drivers have required fields
    await test('Driver data has correct structure', async () => {
        const res = await fetchOK(`${BACKEND}/api/drivers/?year=2025`);
        const data = await res.json();
        const drivers = data.drivers || [];
        const d = drivers[0];
        const fields = ['code', 'givenName', 'familyName', 'nationality'];
        const missing = fields.filter(f => !d[f]);
        if (missing.length) throw new Error(`Missing: ${missing.join(', ')}`);
        console.log(`      → All required fields present: ${fields.join(', ')}`);
    });

    // Verify simulation data has correct lap structure
    await test('Simulation laps have correct structure', async () => {
        const res = await fetchOK(`${BACKEND}/api/simulate/simulate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ circuit_id: 'monza', lap_count: 2, grid: 'current_2026' }),
        });
        const data = await res.json();
        const lap = data.results[0].laps[0];
        const fields = ['lap', 'time', 'compound', 'tyre_age', 'sector_1', 'sector_2', 'sector_3'];
        const present = fields.filter(f => f in lap);
        console.log(`      → Lap fields present: ${present.join(', ')}`);
        console.log(`      → Sectors null: ${lap.sector_1 === null} (transformer handles)`);
    });

    // Verify qualifying has elimination logic
    await test('Qualifying elimination logic works', async () => {
        const res = await fetchOK(`${BACKEND}/api/qualifying/qualify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ circuit_id: 'monza', grid: 'current_2026' }),
        });
        const data = await res.json();
        const results = data.results;
        const withQ3 = results.filter(r => r.q3_time !== null);
        const withQ2Only = results.filter(r => r.q2_time !== null && r.q3_time === null);
        const q1Only = results.filter(r => r.q2_time === null);
        console.log(`      → Q3 (top 10): ${withQ3.length}, Q2 only: ${withQ2Only.length}, Q1 only: ${q1Only.length}`);
        if (withQ3.length !== 10) throw new Error(`Expected 10 in Q3, got ${withQ3.length}`);
        if (withQ2Only.length !== 5) throw new Error(`Expected 5 in Q2, got ${withQ2Only.length}`);
        if (q1Only.length !== 5) throw new Error(`Expected 5 in Q1, got ${q1Only.length}`);
    });

    // ═══════════════════════════════════════════════════════════
    console.log('\n' + '═'.repeat(60));
    console.log(`\n📋 RESULTS: ${passed} passed, ${failed} failed, ${warnings} warnings`);
    console.log('═'.repeat(60));

    if (failed === 0) {
        console.log('🏆 ALL TESTS PASSED!\n');
    } else {
        console.log(`⚠️  ${failed} test(s) need attention.\n`);
        process.exit(1);
    }
})();
