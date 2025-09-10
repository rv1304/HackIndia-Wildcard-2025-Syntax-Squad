;========================
; 1. Facts: Family Members
;========================
(father "John" "Alice")
(father "John" "Bob")
(mother "Mary" "Alice")
(mother "Mary" "Bob")
(father "Paul" "Chris")
(mother "Anna" "Chris")

;========================
; 2. Rules: Relationships
;========================
(parent $x $y) :- (father $x $y)
(parent $x $y) :- (mother $x $y)

(grandparent $x $z) :-
    (parent $x $y)
    (parent $y $z)

(sibling $x $y) :-
    (parent $p $x)
    (parent $p $y)
    (!= $x $y)

;========================
; 3. Function: Add numbers
;========================
(: add (-> Number Number Number))
(= (add $x $y) (+ $x $y))

;========================
; 4. Non-deterministic greeting
;========================
(: greet (-> String))
(greet) = (superpose "Hello!" "Hi there!" "Greetings!" "Hey!")

;========================
; 5. Map example: increment a list
(: map (-> (-> A B) (List A) (List B)))
(= (map $f (cons $x $xs))
   (cons ($f $x) (map $f $xs)))
(= (map $f nil) nil)

;========================
; 6. Main Program (pseudo-entry)
;========================
; Query: Who are John's children?
(father "John" $child)

; Query: Who are Alice's siblings?
(sibling "Alice" $s)

; Call addition
(add 5 7)

; Map example: increment a list
(map (+ 1) (cons 1 (cons 2 (cons 3 nil))))

; Greet randomly
(collapse (greet))
