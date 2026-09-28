import test from 'node:test';
import assert from 'node:assert/strict';
import {AGE_IDS,canonicalizeAgeBands,assertCanonicalAgeBands,containsLegacyAgeBand} from '../src/r04/age-taxonomy.mjs';

test('R51 age compatibility maps legacy IDs only through one temporary table',()=>{
  assert.deepEqual([...canonicalizeAgeBands(['inf','ado'])],['AGE_0_12','AGE_13_17']);
  assert.deepEqual([...canonicalizeAgeBands(['adu'])],['AGE_18_PLUS']);
  assert.deepEqual([...canonicalizeAgeBands(['todas'])],['ALL_AGES']);
  assert.deepEqual([...canonicalizeAgeBands(['inf','todas'])],['ALL_AGES']);
  assert.deepEqual([...canonicalizeAgeBands(['INFANCIA','ADOLESCENCIA','ADULTEZ'])],['AGE_0_12','AGE_13_17','AGE_18_PLUS']);
});
test('R51 new outputs reject legacy age categories',()=>{
  assert.deepEqual([...assertCanonicalAgeBands(['AGE_0_12','AGE_13_17'])],['AGE_0_12','AGE_13_17']);
  assert.throws(()=>assertCanonicalAgeBands(['INFANCIA']),/unknown_or_legacy_age_band/);
  assert.throws(()=>assertCanonicalAgeBands(['TRANSVERSAL']),/unknown_or_legacy_age_band/);
  assert.equal(containsLegacyAgeBand(['AGE_18_PLUS']),false);
  assert.equal(containsLegacyAgeBand(['adu']),true);
});
test('R51 ALL_AGES is a band and cannot be mixed with explicit bands',()=>{
  assert.deepEqual([...AGE_IDS],['AGE_0_12','AGE_13_17','AGE_18_PLUS','ALL_AGES']);
  assert.throws(()=>canonicalizeAgeBands(['ALL_AGES','AGE_18_PLUS']),/all_ages_must_be_exclusive/);
});
