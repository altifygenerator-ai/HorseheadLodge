import {strict as assert} from 'node:assert';
import {getApprovedEmailFact,getPublicFact,proposeDraft,triageInquiry} from './concierge-triage.mjs';
const checks=[
 ['refunds escalate',triageInquiry('I need a refund').kind==='escalation'],
 ['wedding date requires approval',triageInquiry('Is June 14 open for our wedding?').kind==='availability'],
 ['price requires approval',triageInquiry('What is the deposit?').kind==='pricing'],
 ['tours recognized',triageInquiry('Can we come see the venue for a tour?').kind==='tour'],
 ['lodging recognized',triageInquiry('Do the glamping cabins have a hot tub?').kind==='lodging'],
 ['public starting price is not automatically approved',getPublicFact('venue.weekend-starting')!==null&&!getApprovedEmailFact('venue.weekend-starting')],
 ['all example drafts require review',Array.from(['tour','available dates','price','refund','cabins'],t=>proposeDraft(t).autoSend===false&&proposeDraft(t).requiresApproval).every(Boolean)],
 ['no falsely claimed live availability',!proposeDraft('Is Saturday open?').draft.toLowerCase().includes('yes it is available')],
];
for(const [name,passed] of checks){assert.ok(passed,name);console.log('PASS',name)}
console.log(`PASS: ${checks.length} concierge safety tests, no emails sent.`)
