using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEnd.Migrations
{
    /// <inheritdoc />
    public partial class Domain1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "OperationType",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Version = table.Column<int>(type: "int", nullable: false),
                    Active = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OperationType", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Patient",
                columns: table => new
                {
                    AutoId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    FirstName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FullName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MedicalRecord = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EmergencyContact = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AppointmentHistory = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Gender_Name = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Gender_Id = table.Column<int>(type: "int", nullable: true),
                    DateOfBirth = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Email = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Phone = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Address = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Id = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patient", x => x.AutoId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Specialization",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Specialization", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SurgeryRoomStatus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurgeryRoomStatus", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SurgeryRoomType",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurgeryRoomType", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SystemChangeLog",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TableId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Table = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OldValues = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    NewValues = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ChangeDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ChangedBy = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LogType = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemChangeLog", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "OperationTypePhase",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    OperationTypeId = table.Column<int>(type: "int", nullable: false),
                    Name_Name = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name_Id = table.Column<int>(type: "int", nullable: true),
                    Duration = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OperationTypePhase", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OperationTypePhase_OperationType_OperationTypeId",
                        column: x => x.OperationTypeId,
                        principalTable: "OperationType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Staff",
                columns: table => new
                {
                    AutoId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    LicenseNumber = table.Column<int>(type: "int", nullable: false),
                    Email = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Phone = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FirstName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FullName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Role_Name = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Role_Id = table.Column<int>(type: "int", nullable: true),
                    Active = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    SpecializationId = table.Column<int>(type: "int", nullable: true),
                    Id = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Staff", x => x.AutoId);
                    table.ForeignKey(
                        name: "FK_Staff_Specialization_SpecializationId",
                        column: x => x.SpecializationId,
                        principalTable: "Specialization",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SurgeryRoom",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: false),
                    AssignedEquipment = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CurrentStatusId = table.Column<int>(type: "int", nullable: true),
                    TypeId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurgeryRoom", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SurgeryRoom_SurgeryRoomStatus_CurrentStatusId",
                        column: x => x.CurrentStatusId,
                        principalTable: "SurgeryRoomStatus",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SurgeryRoom_SurgeryRoomType_TypeId",
                        column: x => x.TypeId,
                        principalTable: "SurgeryRoomType",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "OperationTypePhaseSpecialization",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SpecializationId = table.Column<int>(type: "int", nullable: true),
                    Count = table.Column<int>(type: "int", nullable: false),
                    OperationTypePhaseId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OperationTypePhaseSpecialization", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OperationTypePhaseSpecialization_OperationTypePhase_Operatio~",
                        column: x => x.OperationTypePhaseId,
                        principalTable: "OperationTypePhase",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_OperationTypePhaseSpecialization_Specialization_Specializati~",
                        column: x => x.SpecializationId,
                        principalTable: "Specialization",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "OperationRequest",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Status_Name = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Status_Id = table.Column<int>(type: "int", nullable: true),
                    DeadlineDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Priority_Name = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Priority_Id = table.Column<int>(type: "int", nullable: true),
                    RequestedByDoctorAutoId = table.Column<int>(type: "int", nullable: true),
                    OperationTypeId = table.Column<int>(type: "int", nullable: true),
                    PatientAutoId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OperationRequest", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OperationRequest_OperationType_OperationTypeId",
                        column: x => x.OperationTypeId,
                        principalTable: "OperationType",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_OperationRequest_Patient_PatientAutoId",
                        column: x => x.PatientAutoId,
                        principalTable: "Patient",
                        principalColumn: "AutoId");
                    table.ForeignKey(
                        name: "FK_OperationRequest_Staff_RequestedByDoctorAutoId",
                        column: x => x.RequestedByDoctorAutoId,
                        principalTable: "Staff",
                        principalColumn: "AutoId");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "DateTimeTuple",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    StaffAutoId = table.Column<int>(type: "int", nullable: true),
                    SurgeryRoomId = table.Column<int>(type: "int", nullable: true),
                    FromDateTime = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ToDateTime = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DateTimeTuple", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DateTimeTuple_Staff_StaffAutoId",
                        column: x => x.StaffAutoId,
                        principalTable: "Staff",
                        principalColumn: "AutoId");
                    table.ForeignKey(
                        name: "FK_DateTimeTuple_SurgeryRoom_SurgeryRoomId",
                        column: x => x.SurgeryRoomId,
                        principalTable: "SurgeryRoom",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Appointment",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Status_Name = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Status_Id = table.Column<int>(type: "int", nullable: true),
                    DateTime = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    OriginatingOnId = table.Column<int>(type: "int", nullable: true),
                    RoomId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Appointment_OperationRequest_OriginatingOnId",
                        column: x => x.OriginatingOnId,
                        principalTable: "OperationRequest",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Appointment_SurgeryRoom_RoomId",
                        column: x => x.RoomId,
                        principalTable: "SurgeryRoom",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AppointmentStaff",
                columns: table => new
                {
                    AppointmentId = table.Column<int>(type: "int", nullable: false),
                    StaffAutoId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentStaff", x => new { x.AppointmentId, x.StaffAutoId });
                    table.ForeignKey(
                        name: "FK_AppointmentStaff_Appointment_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appointment",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppointmentStaff_Staff_StaffAutoId",
                        column: x => x.StaffAutoId,
                        principalTable: "Staff",
                        principalColumn: "AutoId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_OriginatingOnId",
                table: "Appointment",
                column: "OriginatingOnId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_RoomId",
                table: "Appointment",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentStaff_StaffAutoId",
                table: "AppointmentStaff",
                column: "StaffAutoId");

            migrationBuilder.CreateIndex(
                name: "IX_DateTimeTuple_StaffAutoId",
                table: "DateTimeTuple",
                column: "StaffAutoId");

            migrationBuilder.CreateIndex(
                name: "IX_DateTimeTuple_SurgeryRoomId",
                table: "DateTimeTuple",
                column: "SurgeryRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_OperationRequest_OperationTypeId",
                table: "OperationRequest",
                column: "OperationTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_OperationRequest_PatientAutoId",
                table: "OperationRequest",
                column: "PatientAutoId");

            migrationBuilder.CreateIndex(
                name: "IX_OperationRequest_RequestedByDoctorAutoId",
                table: "OperationRequest",
                column: "RequestedByDoctorAutoId");

            migrationBuilder.CreateIndex(
                name: "IX_OperationType_Name_Version",
                table: "OperationType",
                columns: new[] { "Name", "Version" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OperationTypePhase_OperationTypeId",
                table: "OperationTypePhase",
                column: "OperationTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_OperationTypePhaseSpecialization_OperationTypePhaseId",
                table: "OperationTypePhaseSpecialization",
                column: "OperationTypePhaseId");

            migrationBuilder.CreateIndex(
                name: "IX_OperationTypePhaseSpecialization_SpecializationId",
                table: "OperationTypePhaseSpecialization",
                column: "SpecializationId");

            migrationBuilder.CreateIndex(
                name: "IX_Patient_Email",
                table: "Patient",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Patient_Phone",
                table: "Patient",
                column: "Phone",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Staff_Email",
                table: "Staff",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Staff_Id",
                table: "Staff",
                column: "Id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Staff_LicenseNumber",
                table: "Staff",
                column: "LicenseNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Staff_Phone",
                table: "Staff",
                column: "Phone",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Staff_SpecializationId",
                table: "Staff",
                column: "SpecializationId");

            migrationBuilder.CreateIndex(
                name: "IX_SurgeryRoom_CurrentStatusId",
                table: "SurgeryRoom",
                column: "CurrentStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_SurgeryRoom_TypeId",
                table: "SurgeryRoom",
                column: "TypeId");

            migrationBuilder.CreateIndex(
                name: "IX_SystemChangeLog_ChangeDate",
                table: "SystemChangeLog",
                column: "ChangeDate");

            migrationBuilder.CreateIndex(
                name: "IX_SystemChangeLog_Table",
                table: "SystemChangeLog",
                column: "Table");

            migrationBuilder.CreateIndex(
                name: "IX_SystemChangeLog_TableId",
                table: "SystemChangeLog",
                column: "TableId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppointmentStaff");

            migrationBuilder.DropTable(
                name: "DateTimeTuple");

            migrationBuilder.DropTable(
                name: "OperationTypePhaseSpecialization");

            migrationBuilder.DropTable(
                name: "SystemChangeLog");

            migrationBuilder.DropTable(
                name: "Appointment");

            migrationBuilder.DropTable(
                name: "OperationTypePhase");

            migrationBuilder.DropTable(
                name: "OperationRequest");

            migrationBuilder.DropTable(
                name: "SurgeryRoom");

            migrationBuilder.DropTable(
                name: "OperationType");

            migrationBuilder.DropTable(
                name: "Patient");

            migrationBuilder.DropTable(
                name: "Staff");

            migrationBuilder.DropTable(
                name: "SurgeryRoomStatus");

            migrationBuilder.DropTable(
                name: "SurgeryRoomType");

            migrationBuilder.DropTable(
                name: "Specialization");
        }
    }
}
