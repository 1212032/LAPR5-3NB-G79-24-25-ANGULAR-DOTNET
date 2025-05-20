# US 04

## 1. Context

* The patient wants to update their profile.

## 2. Requirements

**US 04** As a Patient, I want to update my user profile, so that I can change my personal details and preferences.

**Acceptance criteria:**
- Patients can log in and update their profile details (e.g., name, contact information, preferences).
- Changes to sensitive data, such as email, trigger an additional verification step (e.g., confirmation email).
- All profile updates are securely stored in the system.
- The system logs all changes made to the patient's profile for audit purposes.

## 3. Analysis

* **Q**: For the audit logging of patient profile updates, could you clarify the level of detail required? Specifically, is it expected to capture a snapshot of the modified fields, or would a more comprehensive solution for tracking changes, including deleted data, be required?
  * **A**: the audit log should be something that allows an auditor to know who and when did a change (what was changed) to the patient profile.
  * **A**: as long as your comply with this, it is a team's decision to either store snapshots or deltas, to either use a simple text file or a separate persistence storage for the log, or any other solution you deem fit.
  * **A**: PS: keep it simple :-)

## 5. Implementation

* PatientUserController
```
string email = _authz.CurrentUserEmail();
var updatedPatient = await _service.UpdateAsync(email, dto);
if (updatedPatient == null)
    return NotFound(new { message = "Patient not found." });
return Ok(updatedPatient);
```
* PatientUserService
```
Patient patient = await _repo.GetByEmailAsync(email);
if (patient == null) return null;

patient.UpdatePersonalInfo(
    dto.FirstName ?? patient.FirstName,
    dto.LastName ?? patient.LastName,
    $"{dto.FirstName ?? patient.FirstName} {dto.LastName ?? patient.LastName}",
    dto.EmergencyContact ?? patient.EmergencyContact,
    dto.Gender ?? patient.Gender.Name,
    dto.DateOfBirth != default ? dto.DateOfBirth : patient.DateOfBirth,
    dto.Email ?? patient.Email,
    dto.Phone ?? patient.Phone,
    dto.Address ?? patient.Address
);

await _unitOfWork.CommitAsync();
return patient.ToDto();
```

## 6. Integration/Demonstration

* To use this funcionality you must log in the system as a Patient.