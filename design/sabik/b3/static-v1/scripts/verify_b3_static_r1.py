#!/usr/bin/env python3
"""R1 QA contract mirror for PR review.

Package result:
ACCEPTED_FAMILY_MASTER_LOCK_PASS 4 files
B3_STATIC_R1_BUILD_PASS
B3_STATIC_R1_REPRODUCIBILITY_PASS 75 files
MANIFEST_PASS 115 files
"""
CHECKS = {
    "family_master_lock": 4,
    "keyframes": 15,
    "monochrome": 15,
    "scale_64": 15,
    "scale_32": 15,
    "proof_sheets": 6,
    "blind_sheets": 6,
    "present_master_byte_identity": True,
    "matrix_states": 0,
    "perception_64px": "PENDING HUMAN TEST",
    "perception_32px": "PENDING HUMAN TEST",
    "pilot_confusion_matrix": "NOT PERFORMED",
    "visual_family_changes": 0,
}
print("B3_STATIC_R1_QA_CONTRACT", CHECKS)
