# US 05

## 1. Context

* The patient wants to delete their profile data.

## 2. Requirements

**US 05** As a Patient, I want to delete my account and all associated data, so that I can exercise my right to be forgotten as per GDPR.

**Acceptance criteria:**
- Patients can request to delete their account through the profile settings.
- The system sends a confirmation email to the patient before proceeding with account deletion.
- Upon confirmation, all personal data is permanently deleted from the system within the legally required time frame (e.g., 30 days).
- Patients are notified once the deletion is complete, and the system logs the action for GDPR compliance.
- Some anonymized data may be retained for legal or research purposes, but all identifiable information is erased.

## 3. Analysis

* **Q**: For the audit logging of patient profile updates, could you clarify the level of detail required? Specifically, is it expected to capture a snapshot of the modified fields, or would a more comprehensive solution for tracking changes, including deleted data, be required?
  * **A**: the audit log should be something that allows an auditor to know who and when did a change (what was changed) to the patient profile.
  * **A**: as long as your comply with this, it is a team's decision to either store snapshots or deltas, to either use a simple text file or a separate persistence storage for the log, or any other solution you deem fit.
  * **A**: PS: keep it simple :-)

## 5. Implementation

* PatientUserController
```
string email = _authz.CurrentUserEmail();
await _service.DeletePatientAsync(email);
return Accepted(new { message = "Patient profile deleted successfully." });
```
* PatientUserService
```
Patient patient = await _repo.GetByEmailAsync(email);
if (patient == null) return null;
_repo.Remove(patient);
await _unitOfWork.CommitAsync();
return patient.ToDto();
```

## 6. Integration/Demonstration

* To use this funcionality you must log in the system as a Patient.