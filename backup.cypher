begin
create (_0:`Task` {`content`:"take a selfie with a stranger", `id`:1, `title`:"task1"})
create (_1:`Task` {`content`:"pick up a guy", `id`:2, `title`:"task2"})
create (_2:`Task` {`content`:"pick up a girl", `id`:3, `title`:"task3"})
create (_3:`Task` {`content`:"do a shot", `id`:4, `title`:"task4"})
create (_4:`Task` {`content`:"chug a beer in under a minute", `id`:5, `title`:"task5"})
create (_5:`Category` {`title`:"Bar"})
create (_6:`Task` {`content`:"talk to a stranger", `id`:6, `title`:"task6"})
create (_5)-[:`CONTAINS`]->(_6)
create (_5)-[:`CONTAINS`]->(_4)
create (_5)-[:`CONTAINS`]->(_3)
create (_5)-[:`CONTAINS`]->(_2)
create (_5)-[:`CONTAINS`]->(_1)
create (_5)-[:`CONTAINS`]->(_0)
;
commit
