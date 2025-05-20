# US 07

## 1. Context

* The patient wants to view their profile data.

## 2. Requirements

**US 07** As a Patient, I want to log in to the healthcare system using my external IAM credentials, so that I can access my appointments, medical records, and other features securely.

**Acceptance criteria:**
- Patients log in via an external Identity and Access Management (IAM) provider (e.g., Google, Facebook, or hospital SSO).
- After successful authentication via the IAM, patients are redirected to the healthcare system with a valid session.
- Patients have access to their appointment history, medical records, and other features relevant to their profile.
- Sessions expire after a defined period of inactivity, requiring reauthentication.

## 3. Analysis

* **Q**: For the audit logging of patient profile updates, could you clarify the level of detail required? Specifically, is it expected to capture a snapshot of the modified fields, or would a more comprehensive solution for tracking changes, including deleted data, be required?
  * **A**: the audit log should be something that allows an auditor to know who and when did a change (what was changed) to the patient profile.
  * **A**: as long as your comply with this, it is a team's decision to either store snapshots or deltas, to either use a simple text file or a separate persistence storage for the log, or any other solution you deem fit.
  * **A**: PS: keep it simple :-)

## 5. Implementation

* PatientUserController
```
string email = _authz.CurrentUserEmail();
return await _service.GetByEmailAsync(email);
```
* PatientUserService
```
Patient patient = await _repo.GetByEmailAsync(email);
return patient?.ToDto();
```

## 6. Integration/Demonstration

* To use this funcionality you must log in the system as a Patient.