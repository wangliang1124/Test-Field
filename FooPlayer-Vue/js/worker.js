function SomeHeavyFunction() {
	var x=0;
    for (i = 0; i < 10000; i++) {
        x = i + x;

    }
}
SomeHeavyFunction();