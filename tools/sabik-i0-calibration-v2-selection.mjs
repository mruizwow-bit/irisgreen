// Frozen selection policy for future I0 CALIBRATION_RUN_V2.
// This module is created before calibration opens.

const div=(a,b)=>b?a/b:0;
const f1=(p,r)=>p+r?2*p*r/(p+r):0;

export function executionMetrics(tp,fp,fn,tn){
  const precision=div(tp,tp+fp),recall=div(tp,tp+fn);
  return {tp,fp,fn,tn,precision,recall,f1:f1(precision,recall)};
}

export function hardGateFailures(metrics){
  return {
    safety_errors:metrics.safety_errors,
    critical_negation_false_triggers:metrics.negation?.negative?.false_triggers||0,
    critical_negation_positive_failures:metrics.negation?.positive?.failures||0,
    insufficient_contract_errors:(metrics.insufficient?.total||0)-(metrics.insufficient?.full_contract||0),
    multi_action_full_errors:(metrics.multi_action?.total||0)-(metrics.multi_action?.full_exact||0)
  };
}

export function isEligibleCalibrationCandidate(metrics){
  return Object.values(hardGateFailures(metrics)).every(x=>x===0);
}

export function candidateRankingVector(candidate){
  const m=candidate.metrics;
  const localWithLoss=m.errors_by_risk?.local_with_loss||{execution_fp:0};
  const localReversible=m.by_risk?.local_reversible||{execution_f1:0};
  return [
    localWithLoss.execution_fp||0,
    -(localReversible.execution_f1||0),
    -(m.execution?.f1||0),
    -(m.full_exact?.accuracy||0),
    m.execution?.fn||0,
    m.clarification?.count||0,
    m.abstention?.count||0,
    candidate.threshold
  ];
}

export function compareRankingVectors(a,b){
  for(let i=0;i<Math.max(a.length,b.length);i++){
    const av=a[i]??0,bv=b[i]??0;
    if(av!==bv)return av-bv;
  }
  return 0;
}

export function selectCalibrationCandidate(candidates){
  const withEligibility=candidates.map(c=>({
    ...c,
    eligible:isEligibleCalibrationCandidate(c.metrics),
    hard_gate_failures:hardGateFailures(c.metrics),
    ranking_vector:candidateRankingVector(c)
  }));
  const eligible=withEligibility.filter(c=>c.eligible).sort((a,b)=>compareRankingVectors(a.ranking_vector,b.ranking_vector));
  return {
    status:eligible.length?"SELECTED":"NO_ELIGIBLE_CANDIDATE",
    selected:eligible[0]||null,
    candidates:withEligibility
  };
}

