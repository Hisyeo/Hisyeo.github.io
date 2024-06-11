parser grammar HisyeoParser;

options {
    tokenVocab=HisyeoLexer;
}

sentences
    : sentence (Period sentence)* Period?
    ;


sentence
    : freeVerbConstituent constituent* ( connector sentence )*
    | constituent+ ( connector sentence )*
    | freeVerbTransitiveConstituent transitiveConstituent* ( connector sentence )*
    | transitiveConstituent+ ( connector sentence )*
    ;

freeVerbConstituent
    : verbMarker? verbModifier* verbPhrase
    ;

freeVerbTransitiveConstituent
    : verbMarker? verbModifier* transitiveVerbPhrase
    ;

constituent
    : preposition
    | verbMarker verbModifier* verbPhrase
    ;

transitiveConstituent
    : transitivePreposition
    | verbMarker verbModifier* transitiveVerbPhrase
    ;

modifierClause
    : <assoc=right> Wo? Ye
      ( expandedWord modifierClause*
      | sameAgentPredicateClause
      | newAgentPredicateClause )
    | Wo
      ( expandedWord modifierClause*
      | sameAgentPredicateClause
      | newAgentPredicateClause  )
    | expandedWord
    | sameAgentPredicateClause  Comma?
    | newAgentPredicateClause
    | ProperNoun
    ;

newAgentPredicateClause
    : Vos sentence
    ;

sameAgentPredicateClause
    : Do verbMarker? verbModifier* transitiveVerbPhrase transitivePreposition*
    | Do verbMarker? verbModifier* verbPhrase preposition*
    ;

terminator
    : Comma
    | Period
    ;


verbPhrase
    : quantity? baseModifier modifierClause*
    | quantity? baseNoun modifierClause*
    | quantity
    ;


transitiveVerbPhrase
    : quantity? baseVerb modifierClause*
    ;

quantity
    : relativeQuantity? nominalQuantity+ 
    ;

preposition
    : intransitivePrepParticle prepPhrase
    ;

transitivePreposition
    : (Co|intransitivePrepParticle) prepPhrase
    ;

intransitivePrepParticle
    : U|Ole|Win|Oxon|Hoi|Vio|Mut|Ovek|Sun|Nenko|Uc|Den|Lon|Gitno
    ;

nounPhrase
    : quantity? nounClause (terminator modifierClause*)?
    | quantity? expandedWord modifierClause*
    ;

nounClause
    : sameAgentPredicateClause
    | newAgentPredicateClause
    ;

prepPhrase
    : nounPhrase (connector nounPhrase)*
    ;

contentWord
    : baseNoun
    | baseVerb 
    | baseModifier
    ;

expandedWord
    : ( pronoun
      | relativeQuantity
      | nominalQuantity
      | contentWord )
    ;


pronoun
    : Ozuul
    | Ono
    | Ovo
    | Ulyo
    | Cizi
    | Dizel
    | Zik
    | Noyo
    | Ni
    | Nimu
    | Loi
    ;


contentParticles
    : We Yok? ( (Oni|Voko|Kon) Yok? )?
    | (Oni|Voko|Kon) Yok? ( We Yok? )?
    ;

baseVerb: contentParticles? rawVerbs ;

verbMarker
    : Li
    | Koi
    | Pit
    | Kuu
    | Ke
    ;

verbModifier
    : Yok
    | Eo
    | Si
    ;

rawVerbs
    : Outo
    | Okulo
    | Ogolol
    | Opulu
    | Onkonu
    | Onkuol
    | Ondo
    | Onton
    | Icwon
    | Isko
    | Imon
    | Inkoton
    | Uskivo
    | Unon
    | Uslek
    | Uvizet
    | Unhilun
    | Hopiyo
    | Hovo
    | Helgo
    | Hevin
    | Huke
    | Hukun
    | Husu
    | Kontol
    | Konzilu
    | Koto
    | Koson
    | Kontesto
    | Kondodu
    | Kelo
    | Kiso
    | Kududo
    | Gomi
    | Goniso
    | Golo
    | Golun
    | Gocidon
    | Golugi
    | Guvuyo
    | Guvio
    | Guwolo
    | Touyen
    | Toswil
    | Tenkin
    | Tuluti
    | Tuu
    | Tulokon
    | Conwepo
    | Couvon
    | Cixin
    | Civu
    | Cihun
    | Citse
    | Cukto
    | Cutie
    | Cutne
    | Cuncion
    | Cunliu
    | Cudo
    | Cungo
    | Culosun
    | Sopole
    | Sopis
    | Solu
    | Sityo
    | Siuvo
    | Suko
    | Xokulu
    | Xontun
    | Xevizec
    | Xiuvu
    | Oitun
    | Xiwon
    | Xusten
    | Doho
    | Dodou
    | Dostoc
    | Deko
    | Denemek
    | Di
    | Diyonde
    | Duuhon
    | Dustu
    | Dupono
    | Dungo
    | Zohit
    | Zowopu
    | Zicou
    | Zuto
    | Poivon
    | Pokovoc
    | Poklon
    | Tuek
    | Posol
    | Pon
    | Pesol
    | Pelexu
    | Peudo
    | Pesnehot
    | Pemon
    | Piek
    | Pucono
    | Puswen
    | Puldo
    | Vohoso
    | Volun
    | Visun
    | Viyuxit
    | Vizi
    | Vulkoi
    | Vucun
    | Vunpo
    | Mokon
    | Moci
    | Monodo
    | Mocile
    | Moniso
    | Muncoti
    | Nocido
    | Niwos
    | Niltugu
    | Wovok
    | Weko
    | Wekeso
    | Wetodu
    | Wetu
    | Lozic
    | Lopotol
    | Luvono
    | Lunsol
    | Yosten
    | Yon
    | Yundou
    | Yupik
    | Yunlon
    | Yunyou
    ;

baseNoun: contentParticles? rawNouns ;

rawNouns
    : Oudi
    | Okoxu
    | Oksun
    | Ocuo
    | Opoki
    | Onomu
    | Ongolo
    | Onvipi
    | Ocoto
    | Osti
    | Ozil
    | Ongo
    | Eloi
    | Eleke
    | Epol
    | Enkomon
    | Enpokon
    | Itihos
    | Istihol
    | Igomo
    | Isenso
    | Isipo
    | Isponxu
    | Ipuwe
    | Inpoli
    | Ile
    | Umo
    | Undovol
    | Unpu
    | Ucumi
    | Usen
    | Usmon
    | Unvuno
    | Ulonvu
    | Ulogun
    | Ulzo
    | Hokoli
    | Hosoun
    | Hoxope
    | Hondon
    | Hoktun
    | Hovezi
    | Honcou
    | Honyo
    | Howuncul
    | Holuk
    | Holmo
    | Henelo
    | Hicu
    | Hiskunco
    | Hustun
    | Huzon
    | Hunsuon
    | Huwu
    | Hulodek
    | Hulu
    | Kolowo
    | Koli
    | Kokoku
    | Kotvusu
    | Kocun
    | Kosmo
    | Komu
    | Kol
    | Kolmudul
    | Kelos
    | Kistose
    | Kiungo
    | Kisko
    | Kino
    | Kinyosel
    | Kuunme
    | Kukwon
    | Kuon
    | Kuocyo
    | Kuoxi
    | Kusowi
    | Kudu
    | Kumun
    | Kunonti
    | Kunhiun
    | Kungiyo
    | Kuncien
    | Kunpi
    | Kulunun
    | Gongoxi
    | Gonpu
    | Goyu
    | Geko
    | Gisgul
    | Gundole
    | Guexo
    | Gueyu
    | Gudolo
    | Guvoxe
    | Gumi
    | Gulu
    | Tohilok
    | Towe
    | Tolen
    | Toliyo
    | Toliko
    | Tolxeto
    | Toxuci
    | Tomos
    | Tetek
    | Tenio
    | Titon
    | Tixo
    | Timiok
    | Tupo
    | Tulono
    | Cokwoli
    | Comen
    | Conoi
    | Cocko
    | Cino
    | Cingi
    | Cikinil
    | Cigilsu
    | Cipon
    | Cuonwun
    | Cui
    | Cundol
    | Culul
    | Culci
    | Sokovu
    | Sotnin
    | Soden
    | Sopoi
    | Solilo
    | Sohouk
    | Sotun
    | Sopo
    | Seki
    | Sekiton
    | Sedu
    | Siskin
    | Sinsi
    | Sieto
    | Sikot
    | Sikin
    | Sintokmo
    | Suhot
    | Sukyunik
    | Suvoun
    | Sutuo
    | Suson
    | Sunpidu
    | Xohovec
    | Xovo
    | Xolu
    | Xomutlo
    | Xemetsen
    | Xicie
    | Xingo
    | Xiulo
    | Ximol
    | Ximu
    | Xincuon
    | Xuk
    | Xuto
    | Xuxok
    | Doinpi
    | Docui
    | Donus
    | Donuxin
    | Dipo
    | Dinci
    | Dinyouc
    | Dumoko
    | Duuncit
    | Duwoni
    | Dulusi
    | Zoso
    | Zoston
    | Zomo
    | Zomi
    | Zonwul
    | Zowo
    | Zoloni
    | Zohun
    | Zogoc
    | Zesto
    | Zizime
    | Zinkon
    | Zixitu
    | Ziziyo
    | Zuko
    | Zuspot
    | Zuhu
    | Zungo
    | Zuntulu
    | Zunlo
    | Poholon
    | Pogo
    | Postovis
    | Poxo
    | Popoun
    | Polce
    | Pokpun
    | Ponti
    | Polvele
    | Peiku
    | Pelete
    | Pitun
    | Pindu
    | Pinleo
    | Piomu
    | Pinton
    | Puswelin
    | Pudogo
    | Pumi
    | Puntut
    | Punduki
    | Vout
    | Vonolon
    | Vonxin
    | Volo
    | Vohon
    | Vecko
    | Venuo
    | Vikwun
    | Vin
    | Vilo
    | Vuus
    | Vukuci
    | Vunie
    | Motuo
    | Mocko
    | Mozun
    | Mongo
    | Mokovo
    | Motowo
    | Moto
    | Motivo
    | Menyuu
    | Minyoto
    | Minyo
    | Miencok
    | Miepil
    | Mikdol
    | Mitmo
    | Micin
    | Mutyu
    | Muni
    | Mulo
    | Muesi
    | Muhoyon
    | Mukonun
    | Muxi
    | Noo
    | Nouku
    | Noso
    | Nosiko
    | Nodu
    | Nozi
    | Nomu
    | Non
    | Nonto
    | Noilu
    | Nokso
    | Neigin
    | Nec
    | Nicu
    | Nixin
    | Nilol
    | Nukulo
    | Nucoto
    | Numuno
    | Nuyo
    | Wokut
    | Wokto
    | Wopi
    | Wowe
    | Woloko
    | Woyu
    | Wolik
    | Wexon
    | Weloi
    | Wikse
    | Wixonu
    | Wik
    | Wipolo
    | Wiluwo
    | Wuto
    | Wutun
    | Wulus
    | Lotzo
    | Lozido
    | Lono
    | Longi
    | Loslino
    | Leknek
    | Lexetko
    | Lenko
    | Leso
    | Lisik
    | Lismu
    | Lipu
    | Limien
    | Luhu
    | Luok
    | Luici
    | Lucku
    | Yokuntik
    | Yogo
    | Yoskinyo
    | Yovuk
    | Yonduyo
    | Youxin
    | Yokue
    | Yocno
    | Yone
    | Ixolo
    | Yinyunci
    ;

baseModifier: contentParticles? rawModifiers ;

rawModifiers
    : Oksios
    | Osyen
    | Opunyun
    | Ovine
    | Omulto
    | Onpule
    | Onwiye
    | Oltu
    | Osole
    | Odon
    | Opok
    | Opostu
    | Eme
    | Evun
    | Eleo
    | Ispulyol
    | Invultin
    | Iwote
    | Ipudu
    | Ilxizuk
    | Uklo
    | Usundul
    | Upolni
    | Utok
    | Usowo
    | Umomi
    | Unidu
    | Uncoi
    | Ulkevi
    | Ulgukin
    | Hoos
    | Hokiki
    | Hokuxi
    | Hosin
    | Homus
    | Hondot
    | Hoyo
    | Henonde
    | Helxun
    | Hiklihos
    | Hitnodet
    | Hizon
    | Hiyoli
    | Huluko
    | Huunhu
    | Hudol
    | Hunsik
    | Kotonhon
    | Kocko
    | Koput
    | Konxo
    | Konpokpo
    | Konpi
    | Konwo
    | Koxente
    | Kodus
    | Konen
    | Kondonse
    | Konpo
    | Konyec
    | Keskin
    | Kexik
    | Kiluku
    | Kioso
    | Kiunlik
    | Kikolo
    | Kinoxi
    | Kutin
    | Kuonxun
    | Kuyo
    | Gosil
    | Govon
    | Gonzil
    | Golpinus
    | Go
    | Gonyumon
    | Gowo
    | Goluo
    | Gemolen
    | Gelmis
    | Guvis
    | Guso
    | Gunokol
    | Gulopi
    | Toci
    | Tocit
    | Tonko
    | Tigoyo
    | Tivulci
    | Tikel
    | Tiku
    | Tut
    | Tunci
    | Cok
    | Cokyen
    | Cosni
    | Conzodo
    | Colot
    | Cot
    | Centik
    | Cenci
    | Cenpo
    | Civulo
    | Cinopu
    | Cies
    | Cienxin
    | Cinzon
    | Cinmi
    | Cunyu
    | Cuti
    | Cuxien
    | Cunvu
    | Sohou
    | Socok
    | Sodolun
    | Sopuni
    | Sovin
    | Somo
    | Sonkon
    | Sonti
    | Sonsus
    | Sondonos
    | Soltustik
    | Senzo
    | Sikisnot
    | Sinexis
    | Sumon
    | Sunpulno
    | Sunyotni
    | Supol
    | Sunkon
    | Suwit
    | Xoinpo
    | Xodilu
    | Xopek
    | Xonluk
    | Xowose
    | Xolxili
    | Xopoi
    | Xon
    | Xone
    | Xecinoc
    | Xepo
    | Xentil
    | Xidetli
    | Xulmindo
    | Dode
    | Dondun
    | Dohil
    | Dokcon
    | Didozu
    | Dile
    | Dusul
    | Dundon
    | Zouk
    | Zomuni
    | Zonupi
    | Zoi
    | Zensi
    | Zigil
    | Zingu
    | Zilyois
    | Potuk
    | Potyoto
    | Pomoge
    | Pono
    | Pongovi
    | Polimot
    | Poyok
    | Polute
    | Pelisis
    | Pislon
    | Pilit
    | Pikonte
    | Pis
    | Pipok
    | Pinhun
    | Pilus
    | Puku
    | Podi
    | Punxin
    | Pundu
    | Puihi
    | Pugot
    | Pusin
    | Puslu
    | Pulo
    | Vonmot
    | Voskultu
    | Volton
    | Volni
    | Velkono
    | Vildonpun
    | Viki
    | Vitikos
    | Vicwo
    | Vixes
    | Vimosyos
    | Vunsut
    | Vunlit
    | Vuxupin
    | Moskul
    | Moxo
    | Moziko
    | Momoki
    | Montuksol
    | Movi
    | Mevus
    | Menekxe
    | Meduson
    | Mixovo
    | Mihuon
    | Miteten
    | Musgul
    | Muun
    | Mukno
    | Mustokin
    | Muveu
    | Muncu
    | Mulu
    | Nokdo
    | Nexe
    | Nepu
    | Nendol
    | Neos
    | Nexodi
    | Nelo
    | Niok
    | Niecni
    | Nupuso
    | Nulun
    | Nulto
    | Wohi
    | Wonkuk
    | Welto
    | Winit
    | Wili
    | Wuktomu
    | Lohot
    | Losol
    | Lomo
    | Londuluk
    | Lo
    | Loncon
    | Legevu
    | Len
    | Lionxin
    | Liule
    | Lito
    | Litiwe
    | Lis
    | Luko
    | Lucik
    | Lunti
    | Youmok
    | Yotkuwo
    | Yonlus
    | Youli
    | Yugoi
    ;

connector
    : En
    | Pine
    | Moliyu
    | Lekin
    | Yodo
    ;

relativeQuantity
    : Otikon
    | Eswen
    | Eto
    | Ilik
    | Cihou
    | Xokon
    | Zotesto
    | Puzok
    | Velcin
    | Moi
    | Menus
    | Youti
    ;

nominalQuantity
    : Onsu
    | Kinse
    | Kut
    | Tou
    | Telo
    | Tiu
    | Tiso
    | Tukwos
    | Cin
    | Vun
    | Son
    | Ses
    | Xeti
    | Xunyu
    | Dus
    | Dui
    | Ziyon
    | Pole
    | Viyen
    | Nonku
    ;