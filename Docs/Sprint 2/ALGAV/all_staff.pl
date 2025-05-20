:-dynamic availability/3.
:-dynamic agenda_staff/3.
:-dynamic agenda_staff1/3.
:-dynamic agenda_operation_room/3.
:-dynamic agenda_operation_room1/3.
:-dynamic better_sol/5.
:-use_module(library(pairs)).


% marcacoes do staff
agenda_staff(d001,20241028,[(720,790,m01),(1080,1140,c01)]).
agenda_staff(d002,20241028,[(850,900,m02),(901,960,m02),(1380,1440,c02)]).
agenda_staff(d003,20241028,[(720,790,m01),(910,980,m02)]).
agenda_staff(d004,20241028,[(850,900,m02),(940,980,c04)]).

agenda_staff(a001,20241028,[]).
agenda_staff(a002,20241028,[]).
agenda_staff(a003,20241028,[]).
agenda_staff(a004,20241028,[]).
agenda_staff(a005,20241028,[]).
agenda_staff(a006,20241028,[]).

agenda_staff(c001,20241028,[]).
agenda_staff(c002,20241028,[]).
agenda_staff(c003,20241028,[]).


% horario de trabalho do staff
timetable(d001,20241028,(480,1200)).
timetable(d002,20241028,(500,1440)).
timetable(d003,20241028,(520,1320)).
timetable(d004,20241028,(620,1020)).

timetable(a001,20241028,(550,1200)).
timetable(a002,20241028,(600,1200)).
timetable(a003,20241028,(550,1200)).
timetable(a004,20241028,(600,1200)).
timetable(a005,20241028,(550,1200)).
timetable(a006,20241028,(600,1200)).

timetable(c001,20241028,(480,1200)).
timetable(c002,20241028,(480,1200)).
timetable(c003,20241028,(480,1200)).


% tipos de cirurgias (com duracao das fases)
surgery(so2,45,60,45).
surgery(so3,45,90,45).
surgery(so4,45,75,45).

% codigos de cirurgias com tipo
surgery_id(so100001,so2).
surgery_id(so100002,so3).
surgery_id(so100003,so4).
%surgery_id(so100004,so2).
%surgery_id(so100005,so4).
%surgery_id(so100006,so2).
%surgery_id(so100007,so3).
%surgery_id(so100008,so2).
%surgery_id(so100009,so2).
%surgery_id(so100010,so2).
%surgery_id(so100011,so4).
%surgery_id(so100012,so2).
%surgery_id(so100013,so2).

% cirurgias atribuidas ao staff
assignment_surgery(so100001,d001).
assignment_surgery(so100002,d002).
assignment_surgery(so100003,d003).
%assignment_surgery(so100004,d001).
%assignment_surgery(so100004,d002).
%assignment_surgery(so100005,d002).
%assignment_surgery(so100005,d003).
%assignment_surgery(so100006,d001).
%assignment_surgery(so100007,d003).
%assignment_surgery(so100008,d004).
%assignment_surgery(so100008,d003).
%assignment_surgery(so100009,d002).
%assignment_surgery(so100009,d004).
%assignment_surgery(so100010,d003).
%assignment_surgery(so100011,d001).
%assignment_surgery(so100012,d001).
%assignment_surgery(so100013,d004).

assignment_anaesthetist(so100001,a001).
assignment_anaesthetist(so100001,a002).
assignment_anaesthetist(so100002,a003).
assignment_anaesthetist(so100002,a004).
assignment_anaesthetist(so100003,a005).
assignment_anaesthetist(so100003,a006).

assignment_cleaner(so100001,c001).
assignment_cleaner(so100002,c002).
assignment_cleaner(so100003,c003).


% marcacoes da sala de operacao
%agenda_operation_room(or1,20241028,[(520,579,so100000),(1000,1059,so099999)]).
agenda_operation_room(or1,20241028,[]).





% ao receber uma lista de tempos ocupados, calcula uma lista dos tempos livres
free_agenda0([],[(0,1440)]).
free_agenda0([(0,Tfin,_)|LT],LT1):-!,free_agenda1([(0,Tfin,_)|LT],LT1).
free_agenda0([(Tin,Tfin,_)|LT],[(0,T1)|LT1]):- T1 is Tin-1,
    free_agenda1([(Tin,Tfin,_)|LT],LT1).

free_agenda1([(_,Tfin,_)],[(T1,1440)]):-Tfin\==1440,!,T1 is Tfin+1.
free_agenda1([(_,_,_)],[]).
free_agenda1([(_,T,_),(T1,Tfin2,_)|LT],LT1):-Tx is T+1,T1==Tx,!,
    free_agenda1([(T1,Tfin2,_)|LT],LT1).
free_agenda1([(_,Tfin1,_),(Tin2,Tfin2,_)|LT],[(T1,T2)|LT1]):-T1 is Tfin1+1,T2 is Tin2-1,
    free_agenda1([(Tin2,Tfin2,_)|LT],LT1).



% recebendo uma lista dos tempos livres disponiveis (de 0 a 1440), retorna uma lista de tempos livres considerando o horario de trabalho
adapt_timetable(D,Date,LFA,LFA2):-timetable(D,Date,(InTime,FinTime)),treatin(InTime,LFA,LFA1),treatfin(FinTime,LFA1,LFA2).

treatin(InTime,[(In,Fin)|LFA],[(In,Fin)|LFA]):-InTime=<In,!.
treatin(InTime,[(_,Fin)|LFA],LFA1):-InTime>Fin,!,treatin(InTime,LFA,LFA1).
treatin(InTime,[(_,Fin)|LFA],[(InTime,Fin)|LFA]).
treatin(_,[],[]).

treatfin(FinTime,[(In,Fin)|LFA],[(In,Fin)|LFA1]):-FinTime>=Fin,!,treatfin(FinTime,LFA,LFA1).
treatfin(FinTime,[(In,_)|_],[]):-FinTime=<In,!.
treatfin(FinTime,[(In,_)|_],[(In,FinTime)]).
treatfin(_,[],[]).



% recebendo varias agendas dos tempos do staff, calcula uma lista dos tempos em comum para a operacao
intersect_all_agendas([Name],Date,LA):-!,availability(Name,Date,LA).
intersect_all_agendas([Name|LNames],Date,LI):-
    availability(Name,Date,LA),
    intersect_all_agendas(LNames,Date,LI1),
    intersect_2_agendas(LA,LI1,LI).

intersect_2_agendas([],_,[]).
intersect_2_agendas([D|LD],LA,LIT):-	intersect_availability(D,LA,LI,LA1),
					intersect_2_agendas(LD,LA1,LID),
					append(LI,LID,LIT).

intersect_availability((_,_),[],[],[]).

intersect_availability((_,Fim),[(Ini1,Fim1)|LD],[],[(Ini1,Fim1)|LD]):-
		Fim<Ini1,!.

intersect_availability((Ini,Fim),[(_,Fim1)|LD],LI,LA):-
		Ini>Fim1,!,
		intersect_availability((Ini,Fim),LD,LI,LA).

intersect_availability((Ini,Fim),[(Ini1,Fim1)|LD],[(Imax,Fmin)],[(Fim,Fim1)|LD]):-
		Fim1>Fim,!,
		min_max(Ini,Ini1,_,Imax),
		min_max(Fim,Fim1,Fmin,_).

intersect_availability((Ini,Fim),[(Ini1,Fim1)|LD],[(Imax,Fmin)|LI],LA):-
		Fim>=Fim1,!,
		min_max(Ini,Ini1,_,Imax),
		min_max(Fim,Fim1,Fmin,_),
		intersect_availability((Fim1,Fim),LD,LI,LA).

min_max(I,I1,I,I1):- I<I1,!.
min_max(I,I1,I1,I).



surgery_total_duration(OpCode, TotalDuration) :-
    surgery_id(OpCode, OpType),
    surgery(OpType, First, Second, Third),
    TotalDuration is First + Second + Third.



sort_surgeries_by_duration(LOpCode, LOpCodeSorted) :-
    findall(Duration-OpCode, (
		% vai buscar um OpCode para cada elemento da lista
        member(OpCode, LOpCode),
		% vai buscar a duracao total da operacao
        surgery_total_duration(OpCode, Duration)
    ), LOpDurations), % LOpDurations contem uma lista do tipo [(Duration, OpCode),(Duration, OpCode),(Duration, OpCode)]
	keysort(LOpDurations, LOpDurationsSortedPairs), % ordena uma lista de pares (chave-valor) pela chave, neste caso a duracao
    pairs_values(LOpDurationsSortedPairs, LOpCodeSorted). % retorna a lista dos codigos de operacoes, ordenado



schedule_all_surgeries(Room,Day):-
										set_prolog_flag(answer_write_options, [max_depth(0)]),
	% retractall limpa as listas
    retractall(agenda_staff1(_,_,_)), % staff, dia, marcacoes (incio,fim,marcacao)
    retractall(agenda_operation_room1(_,_,_)), % sala, dia, marcacoes (incio,fim,marcacao)
    retractall(availability(_,_,_)), % staff, dia, horario livre (incio,fim)
	% copiar agenda de marcacoes de cada staff para uma lista
    findall(_,(agenda_staff(S,Day,Agenda),assertz(agenda_staff1(S,Day,Agenda))),_),
	% copia a agenda da sala para uma lista
    agenda_operation_room(Or,Date,Agenda),assert(agenda_operation_room1(Or,Date,Agenda)),
    % para cada staff, calcula o tempo livre a partir das marcacoes ja existentes e considerando o horario de trabalho -> LFA2
    % insere cada registo LFA2 na lista availability
	findall(_,(agenda_staff1(D,Date,L),free_agenda0(L,LFA),adapt_timetable(D,Date,LFA,LFA2),assertz(availability(D,Date,LFA2))),_),
	% constroi uma lista de codigos de operacoes em LOpCode
    findall(OpCode,surgery_id(OpCode,_),LOpCode),

		% ordenar cirurgias por duracao total
		sort_surgeries_by_duration(LOpCode, LOpCodeSorted),

	% agenda todas as cirurgias (se possivel)
    availability_all_surgeries(LOpCodeSorted,Room,Day),!.


availability_all_surgeries([],_,_).
availability_all_surgeries([OpCode|LOpCode],Room,Day):-
	% busca o tipo de cirurgia a partir do codigo
    surgery_id(OpCode,OpType),
	% busca o tempo da operacao atraves do tipo
	surgery(OpType,TAnesthesia,TSurgery,TCleaning),
	OperationDuration is TAnesthesia+TSurgery+TCleaning,

	% retorna uma lista de possibilidades de horarios (inicio,fim) e uma lista dos medicos
    availability_operation(OpCode,Room,Day,LPossibilities,LDoctors,LAnaesthetists,LCleaners),
	% da lista de possibilidades retorna a primeira
    schedule_first_interval(OperationDuration,LPossibilities,(TinS,_)),
	
	% calcular inicio e fim do horario para cada tipo de staff
    being_end_phases(TinS,TAnesthesia,TSurgery,TCleaning,AnesthetistSlot,DoctorSlot,CleanerSlot,OpCode),
	
    % atribuir o horario a cada um do tipo de staff
    insert_agenda_staff(DoctorSlot,Day,LDoctors),
    insert_agenda_staff(AnesthetistSlot,Day,LAnaesthetists),
    insert_agenda_staff(CleanerSlot,Day,LCleaners),

	% retira da agenda da sala as marcacoes
    retract(agenda_operation_room1(Room,Day,Agenda)),
	% insere nessa lista a nova marcacao
	TfinS is TinS+OperationDuration-1,
    insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
	% reinsere a lista na agenda da sala
    assertz(agenda_operation_room1(Room,Day,Agenda1)),

	% insere o horario na agenda de todos os medicos
    %insert_agenda_doctors((TinS,TfinS,OpCode),Day,LDoctors), % substituido por insert_agenda_staff

	% recursivo para o resto das operacoes
    availability_all_surgeries(LOpCode,Room,Day).



% calcular inicio e fim do horario para cada tipo de staff
being_end_phases(TStart,TAnesthesia,TSurgery,TCleaning,AnesthetistSlot,DoctorSlot,CleanerSlot,OpCode):-
	AnesthetistSlotFim is TStart+TAnesthesia+TSurgery-1,
    AnesthetistSlot=(TStart,AnesthetistSlotFim,OpCode),
	
	DoctorSlotIni is TStart+TAnesthesia,
	DoctorSlotFim is TStart+TAnesthesia+TSurgery-1,
    DoctorSlot=(DoctorSlotIni,DoctorSlotFim,OpCode),
	
	CleanerSlotIni is TStart+TAnesthesia+TSurgery,
	CleanerSlotFim is TStart+TAnesthesia+TSurgery+TCleaning-1,
    CleanerSlot=(CleanerSlotIni,CleanerSlotFim,OpCode).



availability_operation(OpCode,Room,Day,LPossibilities,LDoctors,LAnaesthetists,LCleaners):-
	% busca o tipo de cirurgia a partir do codigo
	surgery_id(OpCode,OpType),
	% busca o tempo da operacao atraves do tipo
	surgery(OpType,TAnesthesia,TSurgery,TCleaning),
	
	% duracao total somando as 3 fases
	OperationDuration is TAnesthesia+TSurgery+TCleaning,
	
	% constroi uma lista dos cirurgioes necessarios para a operacao
    findall(Doctor,assignment_surgery(OpCode,Doctor),LDoctors),
	
	% constroi uma lista dos anestesista necessarios para a operacao
	findall(Anaesthetist,assignment_anaesthetist(OpCode,Anaesthetist),LAnaesthetists),
	
	% constroi uma lista dos limpadores necessarios para a operacao
	findall(Cleaner,assignment_cleaner(OpCode,Cleaner),LCleaners),

	% juntar as 3 listas
	append([LDoctors,LAnaesthetists,LCleaners],LStaff),
	
	% interseta as agendas do staff para o dia -> LA
    intersect_all_agendas(LStaff,Day,LA),
	
	% busca as marcacoes para a sala -> LAgenda
    agenda_operation_room1(Room,Day,LAgenda),
	% calcula os tempos livres para a sala -> LFAgRoom
    free_agenda0(LAgenda,LFAgRoom),
	
	% interseta a agenda livre da sala de operacao com as agendas livres dos medicos
    intersect_2_agendas(LA,LFAgRoom,LIntAgDoctorsRoom),
	
	% remove da lista (de intersecao de agenda dos medicos com a sala) todos os slots que sejam menores que o tempo da operacao (TSurgery)
    remove_unf_intervals(OperationDuration,LIntAgDoctorsRoom,LPossibilities).
	

remove_unf_intervals(_,[],[]).
remove_unf_intervals(TSurgery,[(Tin,Tfin)|LA],[(Tin,Tfin)|LA1]):-DT is Tfin-Tin+1,TSurgery=<DT,!,
    remove_unf_intervals(TSurgery,LA,LA1).
remove_unf_intervals(TSurgery,[_|LA],LA1):- remove_unf_intervals(TSurgery,LA,LA1).



schedule_first_interval(TSurgery,[(Tin,_)|_],(Tin,TfinS)):-
    TfinS is Tin + TSurgery - 1.

% insere o horario na agenda das salas
insert_agenda((TinS,TfinS,OpCode),[],[(TinS,TfinS,OpCode)]).
insert_agenda((TinS,TfinS,OpCode),[(Tin,Tfin,OpCode1)|LA],[(TinS,TfinS,OpCode),(Tin,Tfin,OpCode1)|LA]):-TfinS<Tin,!.
insert_agenda((TinS,TfinS,OpCode),[(Tin,Tfin,OpCode1)|LA],[(Tin,Tfin,OpCode1)|LA1]):-insert_agenda((TinS,TfinS,OpCode),LA,LA1).

% insere o horario na agenda dos medicos
%insert_agenda_doctors(_,_,[]).
%insert_agenda_doctors((TinS,TfinS,OpCode),Day,[Doctor|LDoctors]):-
    %retract(agenda_staff1(Doctor,Day,Agenda)),
    %insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
    %assert(agenda_staff1(Doctor,Day,Agenda1)),
    %insert_agenda_doctors((TinS,TfinS,OpCode),Day,LDoctors).

% insere o horario na agenda do staff
insert_agenda_staff(_,_,[]).
insert_agenda_staff((TinS,TfinS,OpCode),Day,[Staff|LStaff]):-
    retract(agenda_staff1(Staff,Day,Agenda)),
    insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
    assert(agenda_staff1(Staff,Day,Agenda1)),
    insert_agenda_staff((TinS,TfinS,OpCode),Day,LStaff).




obtain_better_sol(Room,Day,AgOpRoomBetter,LAgDoctorsBetter,TFinOp):-
		get_time(Ti),
		(obtain_better_sol1(Room,Day);true),
		retract(better_sol(Day,Room,AgOpRoomBetter,LAgDoctorsBetter,TFinOp)),
            write('Final Result: AgOpRoomBetter='),write(AgOpRoomBetter),nl,
            write('LAgDoctorsBetter='),write(LAgDoctorsBetter),nl,
            write('TFinOp='),write(TFinOp),nl,
		get_time(Tf),
		T is Tf-Ti,
		write('Tempo de geracao da solucao:'),write(T),nl.


obtain_better_sol1(Room,Day):-
    asserta(better_sol(Day,Room,_,_,1441)),
    findall(OpCode,surgery_id(OpCode,_),LOC),!,
    permutation(LOC,LOpCode),
    retractall(agenda_staff1(_,_,_)),
    retractall(agenda_operation_room1(_,_,_)),
    retractall(availability(_,_,_)),
    findall(_,(agenda_staff(D,Day,Agenda),assertz(agenda_staff1(D,Day,Agenda))),_),
    agenda_operation_room(Room,Day,Agenda),assert(agenda_operation_room1(Room,Day,Agenda)),
    findall(_,(agenda_staff1(D,Day,L),free_agenda0(L,LFA),adapt_timetable(D,Day,LFA,LFA2),assertz(availability(D,Day,LFA2))),_),
    availability_all_surgeries(LOpCode,Room,Day),
    agenda_operation_room1(Room,Day,AgendaR),
		update_better_sol(Day,Room,AgendaR,LOpCode),
		fail.

update_better_sol(Day,Room,Agenda,LOpCode):-
                better_sol(Day,Room,_,_,FinTime),
                reverse(Agenda,AgendaR),
                evaluate_final_time(AgendaR,LOpCode,FinTime1),
             write('Analysing for LOpCode='),write(LOpCode),nl,
             write('now: FinTime1='),write(FinTime1),write(' Agenda='),write(Agenda),nl,
		FinTime1<FinTime,
             write('best solution updated'),nl,
                retract(better_sol(_,_,_,_,_)),
                findall(Doctor,assignment_surgery(_,Doctor),LDoctors1),
                remove_equals(LDoctors1,LDoctors),
                list_doctors_agenda(Day,LDoctors,LDAgendas),
		asserta(better_sol(Day,Room,Agenda,LDAgendas,FinTime1)).

evaluate_final_time([],_,1441).
evaluate_final_time([(_,Tfin,OpCode)|_],LOpCode,Tfin):-member(OpCode,LOpCode),!.
evaluate_final_time([_|AgR],LOpCode,Tfin):-evaluate_final_time(AgR,LOpCode,Tfin).

list_doctors_agenda(_,[],[]).
list_doctors_agenda(Day,[D|LD],[(D,AgD)|LAgD]):-agenda_staff1(D,Day,AgD),list_doctors_agenda(Day,LD,LAgD).

remove_equals([],[]).
remove_equals([X|L],L1):-member(X,L),!,remove_equals(L,L1).
remove_equals([X|L],[X|L1]):-remove_equals(L,L1).
