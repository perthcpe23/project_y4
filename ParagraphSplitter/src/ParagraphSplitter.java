import java.io.*;
import java.sql.*;
import java.util.Properties;

public class ParagraphSplitter {
	
	private static final String CONNECTION_URL_PROPERTY = "connection.url";
	private static final String JDBC_DRIVER_NAME_PROPERTY = "jdbc.driver.class.name";

	private static String connectionUrl;
	private static String jdbcDriverName;

        private static void loadConfiguration() throws IOException {
                InputStream input = null;
                try {
                        String filename = ParagraphSplitter.class.getSimpleName() + ".conf";
                        input = ParagraphSplitter.class.getClassLoader().getResourceAsStream(filename);
                        Properties prop = new Properties();
                        prop.load(input);
        
                        connectionUrl = prop.getProperty(CONNECTION_URL_PROPERTY);
                        jdbcDriverName = prop.getProperty(JDBC_DRIVER_NAME_PROPERTY);
                } finally {
                        try {
                                if (input != null)
                                        input.close();
                        } catch (IOException e) {
                                // nothing to do
                        }
                }
        }

	public static void main(String[] args) throws FileNotFoundException, IOException, UnsupportedEncodingException, SQLException, InstantiationException, IllegalAccessException, ClassNotFoundException {
		
		File fileDir = new File("D:\\Course 4th year\\Senior project\\AL-K-Fon.txt");
		BufferedReader in = new BufferedReader(
		new InputStreamReader(new FileInputStream(fileDir), "UTF8"));
		String str;
		loadConfiguration();
		int i = 1;
		Class.forName("com.mysql.jdbc.Driver").newInstance();
		StringBuilder paragraph = new StringBuilder();
		Connection conn = DriverManager.getConnection(connectionUrl);
	//	Statement st = conn.createStatement();
		while ((str = in.readLine()) != null) {
			if(!str.trim().isEmpty()){
				/* //check last char of each line
				System.out.println("Last char of line " + i + ": "+str.charAt(str.length() - 1));
				int ascii = str.charAt(str.length() - 1);
				System.out.println("ASCII: " + ascii );
				 */
				//replace �����
				str = str.replaceAll(" �","�");
				str = str.replaceAll(" ��", "��");
				str = str.replaceAll(" ��", "��");
				str = str.replaceAll(" ��", "��");
				str = str.replaceAll(" ��", "��");
			
				//System.out.println(str);
				paragraph.append(str);
				if(str.charAt(str.length() - 1) == ' ') {
					String insert = new String();
					insert = paragraph.toString();
					System.out.println("Paragraph "+i+" : "+insert);
					i++;
					paragraph.setLength(0);
					//st.executeUpdate("INSERT INTO testStoreText (content) values ('" + insert + "')");
				}
				else paragraph.append(System.lineSeparator());
			}
		}
		in.close();
		
		Class.forName(jdbcDriverName);

		Connection con = DriverManager.getConnection(connectionUrl);

		Statement stmt = con.createStatement();

		ResultSet rs = stmt.executeQuery("SELECT * FROM testStoreText");

		System.out.println("\n== Begin Query Results ======================");

		// print the results to the console
		while (rs.next()) {
			// the example query returns one String column
			System.out.println(rs.getString(1));
		}
	/*	ResultSet rs = st.executeQuery("SELECT * FROM testStoreText");
	    if (st.execute("SELECT * FROM testStoreText")) {
	        rs = st.getResultSet();
	        ResultSetMetaData rsmd = rs.getMetaData();
	        int columnsNumber = rsmd.getColumnCount();
	        while (rs.next()) {
	            for (int j = 1; j <= columnsNumber; j++) {
	                if (j > 1) System.out.print(",  ");
	                String columnValue = rs.getString(i);
	                System.out.print(columnValue + " " + rsmd.getColumnName(i));
	            }
	            System.out.println("");
	        }
	    }*/
	}
}