package dot.rural.sepake.pure;

import java.io.InputStream;
import java.util.HashSet;
import java.util.Set;

import javax.xml.parsers.SAXParserFactory;

import org.junit.Assert;
import org.junit.Test;

public class PureSaxHandlerTest {
    @Test
    public void testProjectRural() throws Exception {
        final InputStream is = getClass().getResourceAsStream("search-projects-for-rural.xml");
        final Set<String> output = new HashSet<String>();
        try {
            SAXParserFactory.newInstance().newSAXParser().parse(is, new PureSaxHandler(
                    new TripleSink<String, String, String>() {
                        public void addTriple(final String first, final String second, final String third) {
                            output.add(String.format("%s %s %s", first, second, third));
                        }
                    }));
        } finally {
            is.close();
        }
        Assert.assertEquals(65, output.size());
        Assert.assertTrue(output.contains("<Person#0606734d-5693-49ea-9ee3-cd4b8ddad60b> foaf:givenName 'Peter'"));
    }
}