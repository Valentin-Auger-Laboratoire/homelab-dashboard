// Tests du moteur de supervision : node tests/test.js
const assert = require('assert');
const H = require('../homelab.js');

(async () => {
  // Panne forcée : up -> degraded (1er échec) -> down (3e échec) -> up (retour)
  const probe = H.simProbe(1);
  const m = H.Monitor({ services: [{ id: 'nas', name: 'NAS', base: 4, loss: 0 }], probe, warnMs: 150, failThreshold: 3 });
  for (let i = 0; i < 5; i++) await m.tick(i);
  assert.strictEqual(m.states[0].status, 'up');
  probe.outage('nas', 4);
  for (let i = 5; i < 12; i++) await m.tick(i);
  const seq = m.events.slice().reverse().map((e) => e.to);
  assert.deepStrictEqual(seq, ['degraded', 'down', 'up']);

  // Ralentissement : latence > seuil -> degraded, puis retour à up
  const p2 = H.simProbe(2);
  const m2 = H.Monitor({ services: [{ id: 'ha', name: 'HA', base: 12, loss: 0 }], probe: p2, warnMs: 150 });
  await m2.tick(0);
  p2.slowdown('ha', 2);
  await m2.tick(1); assert.strictEqual(m2.states[0].status, 'degraded');
  await m2.tick(2); await m2.tick(3); assert.strictEqual(m2.states[0].status, 'up');

  // Seuils des ressources
  assert.strictEqual(H.level('disk', 79), 'ok');
  assert.strictEqual(H.level('disk', 85), 'warn');
  assert.strictEqual(H.level('disk', 95), 'crit');

  // Lecture de la configuration JSON
  const c = H.parseConfig('{"interval":10,"services":[{"name":"NAS","url":"http://192.168.1.10:5000"}]}');
  assert.strictEqual(c.services.length, 1); assert.strictEqual(c.interval, 10);
  assert.strictEqual(H.parseConfig('pas du json').error, 'json');
  assert.strictEqual(H.parseConfig('[{"name":"x","url":"ftp://a"}]').error, 'url');
  console.log('OK : tous les tests passent');
})();
