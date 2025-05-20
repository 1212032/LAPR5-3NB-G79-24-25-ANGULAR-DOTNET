# US 14

## 1. Context

*  Implement functionality for an Admin to deactivate a staff profile.

## 2. Requirements

**US 14** As an Admin, I want to deactivate a staff profile, so that I can remove them from the hospital’s active roster without losing their historical data.

**Acceptance criteria:**
- Admins can search for and select a staff profile to deactivate.
- Deactivating a staff profile removes them from the active roster, but their historical data (e.g.,
appointments) remains accessible.
- The system confirms deactivation and records the action for audit purposes.


## 3. Analysis



## 4. Design

### 4.1. Realization

##### Level 1
![Sequence Diagram](svg/SequenceDiagram_Lvl1.svg)

##### Level 2
![Sequence Diagram](svg/SequenceDiagram_Lvl2.svg)

##### Level 3
![Sequence Diagram](svg/SequenceDiagram_Lvl3.svg)

### 4.2. Class Diagram

![Class Diagram](svg/ClassDiagram.svg)

### 4.3. Applied Patterns

Applied Patterns description in [DevelopmentPatterns](../Global/DevelopmentPatterns/readme.md)


### 4.4. Tests

![Postman Tests](png/Postman-Staff-Tests.png)

```
[Theory]
[InlineData("D202400001", "email@email.com", "918596542", "Carlos", "Sainz", "Doctor")]
public void EnsureInactivateWorks(string licenseNumber, string email, string phone, string firstName, string lastName,
    string role)
{
    Specialization specialization = new Specialization("Genecologist");
    var availabilitySlots = new List<DateTimeTuple>
    {
        new DateTimeTuple(DateTime.Now, DateTime.Now.AddHours(1))
    };

    var staff = new Staff(licenseNumber, email, phone, firstName, lastName, role, availabilitySlots, specialization);
    
    staff.Inactivate();

    Assert.False(staff.Active);
}
```

## 5. Implementation

* Controller
```
var dto = await _service.InactivateAsync(id);
if (dto == null)
{
    return NotFound();
}
return Ok(dto);
```

* Service
```
Staff staff = await this._staffRepo.GetByIdAsync(new StaffId(id));
if (staff == null)
    return null;

staff.Inactivate();
await this._unitOfWork.CommitAsync();

return staff.ToDto();
```

## 6. Integration/Demonstration

* To use this funcionality you must log in the system as an Admin.
