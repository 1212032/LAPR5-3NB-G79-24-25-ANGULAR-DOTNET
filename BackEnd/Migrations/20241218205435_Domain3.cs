using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEnd.Migrations
{
    /// <inheritdoc />
    public partial class Domain3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppointmentStaff");

            migrationBuilder.CreateTable(
                name: "AppointmentPhase",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    AppointmentId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentPhase", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppointmentPhase_Appointment_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appointment",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AppointmentPhaseStaff",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    StaffAutoId = table.Column<int>(type: "int", nullable: true),
                    AppointmentPhaseId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentPhaseStaff", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppointmentPhaseStaff_AppointmentPhase_AppointmentPhaseId",
                        column: x => x.AppointmentPhaseId,
                        principalTable: "AppointmentPhase",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AppointmentPhaseStaff_Staff_StaffAutoId",
                        column: x => x.StaffAutoId,
                        principalTable: "Staff",
                        principalColumn: "AutoId");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentPhase_AppointmentId",
                table: "AppointmentPhase",
                column: "AppointmentId");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentPhaseStaff_AppointmentPhaseId",
                table: "AppointmentPhaseStaff",
                column: "AppointmentPhaseId");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentPhaseStaff_StaffAutoId",
                table: "AppointmentPhaseStaff",
                column: "StaffAutoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppointmentPhaseStaff");

            migrationBuilder.DropTable(
                name: "AppointmentPhase");

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
                name: "IX_AppointmentStaff_StaffAutoId",
                table: "AppointmentStaff",
                column: "StaffAutoId");
        }
    }
}
