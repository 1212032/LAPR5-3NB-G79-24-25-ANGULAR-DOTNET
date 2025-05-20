:-dynamic generations/1.
:-dynamic population/1.
:-dynamic prob_crossover/1.
:-dynamic prob_mutation/1.
:-dynamic stagnation/1.

:-dynamic availability/3.
:-dynamic agenda_staff/3.
:-dynamic agenda_staff1/3.
:-dynamic agenda_operation_room/3.
:-dynamic agenda_operation_room1/3.


% marcacoes do staff
%agenda_staff(d001,20241028,[(720,790,m01),(1080,1140,c01)]).
agenda_staff(d001,20241028,[(550,620,m01)]).
%agenda_staff(d001,20241028,[]).
%agenda_staff(d002,20241028,[(850,900,m02),(901,960,m02),(1380,1440,c02)]).
agenda_staff(d002,20241028,[(850,900,m02)]).
%agenda_staff(d002,20241028,[]).
%agenda_staff(d003,20241028,[(720,790,m01),(910,980,m02)]).
agenda_staff(d003,20241028,[(1000,1080,m02)]).
%agenda_staff(d003,20241028,[]).
agenda_staff(d004,20241028,[(850,900,m02),(940,980,c04)]).
%agenda_staff(d001,20241028,[]).
%agenda_staff(d002,20241028,[]).
%agenda_staff(d003,20241028,[]).
%agenda_staff(d004,20241028,[]).

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
timetable(d002,20241028,(480,1440)).
timetable(d003,20241028,(520,1320)).
timetable(d004,20241028,(620,1020)).

timetable(a001,20241028,(480,1200)).
timetable(a002,20241028,(480,1200)).
timetable(a003,20241028,(480,1200)).
timetable(a004,20241028,(600,1200)).
timetable(a005,20241028,(550,1200)).
timetable(a006,20241028,(600,1200)).

timetable(c001,20241028,(480,1200)).
timetable(c002,20241028,(480,1200)).
timetable(c003,20241028,(480,1200)).


% tipos de cirurgias (com duracao das fases)
%surgery(so2,45,60,45).
%surgery(so3,45,90,45).
%surgery(so4,45,75,45).
surgery(so2,15,45,15).
surgery(so3,15,30,15).
surgery(so4,15,35,15).

% codigos de cirurgias com tipo
surgery_id(so100001,so2).
surgery_id(so100002,so3).
surgery_id(so100003,so4).
surgery_id(so100004,so2).
%surgery_id(so100005,so4).
%surgery_id(so100006,so2).
%surgery_id(so100007,so3).
%surgery_id(so100008,so2).
%surgery_id(so100009,so2).
%surgery_id(so100010,so2).
%surgery_id(so100011,so4).
%surgery_id(so100012,so2).
%surgery_id(so100013,so2).
surgeries(4).

% cirurgias atribuidas ao staff
assignment_surgery(so100001,d001).
assignment_surgery(so100002,d002).
assignment_surgery(so100003,d003).
assignment_surgery(so100004,d001).
assignment_surgery(so100004,d002).
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



% parameters initialization
initialize:-write('Number of new generations: '),read(NG),
    (retract(generations(_));true), asserta(generations(NG)),
	write('Population size: '),read(PS),
	(retract(population(_));true), asserta(population(PS)),
	write('Probability of crossover (%):'), read(P1),
	PC is P1/100,
	(retract(prob_crossover(_));true),	asserta(prob_crossover(PC)),
	write('Probability of mutation (%):'), read(P2),
	PM is P2/100,
	(retract(prob_mutation(_));true), asserta(prob_mutation(PM)),
	write('Max stagnation: '),read(ST),
	(retract(stagnation(_));true), asserta(stagnation(ST)).

generate:-
    initialize,
    generate_population(Pop),
    write('Pop='),write(Pop),nl,
    evaluate_population(Pop,PopValue),
    write('PopValue='),write(PopValue),nl,
    order_population(PopValue,PopOrd),
    generations(NG),
    generate_generation(0,NG,PopOrd,99999,0).

generate_population(Pop):-
    population(PopSize),
    surgeries(NumT),
    findall(Surgery,surgery_id(Surgery,_),SurgeryList),
    generate_population(PopSize,SurgeryList,NumT,Pop).

generate_population(0,_,_,[]):-!.
generate_population(PopSize,SurgeryList,NumT,[Ind|Rest]):-
    PopSize1 is PopSize-1,
    generate_population(PopSize1,SurgeryList,NumT,Rest),
    generate_individual(SurgeryList,NumT,Ind),
    not(member(Ind,Rest)).
generate_population(PopSize,SurgeryList,NumT,L):-
    generate_population(PopSize,SurgeryList,NumT,L).

generate_individual([G],1,[G]):-!.

generate_individual(SurgeryList,NumT,[G|Rest]):-
    NumTemp is NumT + 1, % to use with random
    random(1,NumTemp,N),
    remove(N,SurgeryList,G,NewList),
    NumT1 is NumT-1,
    generate_individual(NewList,NumT1,Rest).

remove(1,[G|Rest],G,Rest).
remove(N,[G1|Rest],G,[G1|Rest1]):-
    N1 is N-1,
    remove(N1,Rest,G,Rest1).
	
evaluate_population([],[]).
evaluate_population([Ind|Rest],[Ind*V|Rest1]) :-
    (   schedule_all_surgeries(Ind, or1, 20241028, V)
    ->  true
    ;   V = 99999  % Valor alto para sinalizar falha na atribuicao
    ),
    evaluate_population(Rest, Rest1).

order_population(PopValue,PopValueOrd):-
    bsort(PopValue,PopValueOrd).

bsort([X],[X]):-!.
bsort([X|Xs],Ys):-
    bsort(Xs,Zs),
    bchange([X|Zs],Ys).

bchange([X],[X]):-!.
bchange([X*VX,Y*VY|L1],[Y*VY|L2]):-
    VX>VY,!,
    bchange([X*VX|L1],L2).
bchange([X|L1],[X|L2]):-bchange(L1,L2).



generate_generation(G, G, Pop, _, _):-!,
    write('Generation '), write(G), write(':'), nl, write(Pop), nl.
generate_generation(N, MaxGen, Pop, BestSoFar, StagnationCount):-
    write('Generation '), write(N), write(':'), nl, write(Pop), nl,
    crossover(Pop, NPop1),
    mutation(NPop1, NPop),
    evaluate_population(NPop, NPopValue),
    order_population(NPopValue, NPopOrd),

    select_new_generation(Pop, NPopOrd, NewPop),

    NewPop = [_*BestVal|_],
    ((BestVal < BestSoFar, !,
        NewBest = BestVal, UpdatedCount = 0)
    ;
    (NewBest = BestSoFar, UpdatedCount is StagnationCount + 1)),
    ((stagnation(ST),UpdatedCount >= ST, !,
        write('Algorithm stopped due to stagnation.'), nl)
    ;
    (N1 is N + 1,
    generate_generation(N1, MaxGen, NewPop, NewBest, UpdatedCount))).



% Seleção da nova geração garantindo o melhor indivíduo
select_new_generation(CurrentPop, Descendants, NewPop) :-
    append(CurrentPop, Descendants, CombinedPop),
    order_population(CombinedPop, OrderedPop), % Ordena combinando as populações
    keep_best(OrderedPop, BestInd),
    remove_individual(OrderedPop, BestInd, RestPop),
    population(PopSize),
    NumToSelect is PopSize - 1,
    random_permutation(RestPop, ShuffledPop),
    select_top(NumToSelect, ShuffledPop, SelectedPop),
    append([BestInd], SelectedPop, NewPop).

keep_best([Best*Val|_], Best*Val).

remove_individual([Ind|Rest], Ind, Rest) :- !.
remove_individual([Other|Rest], Ind, [Other|NewRest]) :-
    remove_individual(Rest, Ind, NewRest).

select_top(0, _, []) :- !.
select_top(_, [], []) :- !.
select_top(N, [Ind|Rest], [Ind|Selected]) :-
    N1 is N - 1,
    select_top(N1, Rest, Selected).



generate_crossover_points(P1,P2):- generate_crossover_points1(P1,P2).

generate_crossover_points1(P1,P2):-
	surgeries(N),
	NTemp is N+1,
	random(1,NTemp,P11),
	random(1,NTemp,P21),
	P11\==P21,!,
	((P11<P21,!,P1=P11,P2=P21);P1=P21,P2=P11).
generate_crossover_points1(P1,P2):-
	generate_crossover_points1(P1,P2).

crossover([],[]).
crossover([Ind*_],[Ind]).
crossover([Ind1*_,Ind2*_|Rest],[NInd1,NInd2|Rest1]):-
	generate_crossover_points(P1,P2),
	prob_crossover(Pcruz),random(0.0,1.0,Pc),
	((Pc =< Pcruz,!,
        cross(Ind1,Ind2,P1,P2,NInd1),
	  cross(Ind2,Ind1,P1,P2,NInd2))
	;
	(NInd1=Ind1,NInd2=Ind2)),
	crossover(Rest,Rest1).


fillh([ ],[ ]).
fillh([_|R1],[h|R2]):-
        fillh(R1,R2).
sublist(L1,I1,I2,L):-I1 < I2,!,
    sublist1(L1,I1,I2,L).
sublist(L1,I1,I2,L):-sublist1(L1,I2,I1,L).
sublist1([X|R1],1,1,[X|H]):-!, fillh(R1,H).
sublist1([X|R1],1,N2,[X|R2]):-!,N3 is N2 - 1,
        sublist1(R1,1,N3,R2).
sublist1([_|R1],N1,N2,[h|R2]):-N3 is N1 - 1,
                N4 is N2 - 1,
                sublist1(R1,N3,N4,R2).
rotate_right(L,K,L1):- surgeries(N),
        T is N - K,
        rr(T,L,L1).
rr(0,L,L):-!.
rr(N,[X|R],R2):- N1 is N - 1,
        append(R,[X],R1),
        rr(N1,R1,R2).
remove([],_,[]):-!.
remove([X|R1],L,[X|R2]):- not(member(X,L)),!,
        remove(R1,L,R2).
remove([_|R1],L,R2):-
    remove(R1,L,R2).
insert([],L,_,L):-!.
insert([X|R],L,N,L2):-
    surgeries(T),
    ((N>T,!,N1 is N mod T);N1 = N),
    insert1(X,N1,L,L1),
    N2 is N + 1,
    insert(R,L1,N2,L2).
insert1(X,1,L,[X|L]):-!.
insert1(X,N,[Y|L],[Y|L1]):-
    N1 is N-1,
    insert1(X,N1,L,L1).
cross(Ind1,Ind2,P1,P2,NInd11):-
    sublist(Ind1,P1,P2,Sub1),
    surgeries(NumT),
    R is NumT-P2,
    rotate_right(Ind2,R,Ind21),
    remove(Ind21,Sub1,Sub2),
    P3 is P2 + 1,
    insert(Sub2,Sub1,P3,NInd1),
    removeh(NInd1,NInd11).
removeh([],[]).
removeh([h|R1],R2):-!,
    removeh(R1,R2).
removeh([X|R1],[X|R2]):-
    removeh(R1,R2).


mutation([],[]).
mutation([Ind|Rest],[NInd|Rest1]):-
	prob_mutation(Pmut),
	random(0.0,1.0,Pm),
	((Pm < Pmut,!,mutacao1(Ind,NInd));NInd = Ind),
	mutation(Rest,Rest1).

mutacao1(Ind,NInd):-
	generate_crossover_points(P1,P2),
	mutacao22(Ind,P1,P2,NInd).

mutacao22([G1|Ind],1,P2,[G2|NInd]):-
	!, P21 is P2-1,
	mutacao23(G1,P21,Ind,G2,NInd).
mutacao22([G|Ind],P1,P2,[G|NInd]):-
	P11 is P1-1, P21 is P2-1,
	mutacao22(Ind,P11,P21,NInd).

mutacao23(G1,1,[G2|Ind],G2,[G1|Ind]):-!.
mutacao23(G1,P,[G|Ind],G2,[G|NInd]):-
	P1 is P-1,
	mutacao23(G1,P1,Ind,G2,NInd).















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


schedule_all_surgeries(LOpCode,Room,Day,Max):-
	% retractall limpa as listas
    retractall(agenda_staff1(_,_,_)), % staff, dia, marcacoes (incio,fim,marcacao)
    retractall(agenda_operation_room1(_,_,_)), % sala, dia, marcacoes (incio,fim,marcacao)
    retractall(availability(_,_,_)), % staff, dia, horario livre (incio,fim)
	% copiar agenda de marcacoes de cada staff para uma lista
    findall(_,(agenda_staff(S,Day,Agenda),assertz(agenda_staff1(S,Day,Agenda))),_),
    % para cada staff, calcula o tempo livre a partir das marcacoes ja existentes e considerando o horario de trabalho -> LFA2
    % insere cada registo LFA2 na lista availability
	findall(_,(agenda_staff1(D,Date,L),free_agenda0(L,LFA),adapt_timetable(D,Date,LFA,LFA2),assertz(availability(D,Date,LFA2))),_),
	% copia a agenda da sala para uma lista
    agenda_operation_room(Or,Date,Agenda),assert(agenda_operation_room1(Or,Date,Agenda)),
	% agenda todas as cirurgias (se possivel)
    availability_all_surgeries(LOpCode,Room,Day),
	agenda_operation_room1(Room,Day,AgendaR),
	get_end_value(AgendaR,_,Max).


get_end_value([], End, End).
get_end_value([(_,H2,_)|T], _, Last):-
	get_end_value(T, H2, Last).


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
